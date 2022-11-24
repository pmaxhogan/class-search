import {createWriteStream} from 'node:fs';
import * as fs from 'node:fs/promises';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';
import {XMLParser} from 'fast-xml-parser';
import { strict as assert } from 'node:assert';

import {getFromCache, saveToCache} from './cache.js';
import {xmlToClassList, ICStateStaleError, isUnauthenticated} from "./xmlToClassList.js";
import {loadCookie, saveCookie} from "./cookie.js";

const streamPipeline = promisify(pipeline);

const starterIcStateNum = 0;
const starterCookie = await loadCookie();

if(!starterCookie){
    throw new Error('No cookie found');
}

const starterCookies = starterCookie.split(";").map(cookie => cookie.trim());
let expireCookie = starterCookies.find(cookie => cookie.startsWith("PS_TOKENEXPIRE="));
const otherCookies = starterCookies.filter(cookie => !cookie.startsWith("PS_TOKENEXPIRE="));
let icStateNum = starterIcStateNum;


const getBody = (courseCode, icyPos, icStateNum) =>
    `ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=${icStateNum}&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICModelCancel=0&ICXPos=0&ICYPos=${icyPos}&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICSkipPending=0&ICAutoSave=0&ICResubmit=0&ICSID=escLGZDl5T8ZaVoPwha3C7zaFdXqAO9JNnruwKpZ5os%3D&ICActionPrompt=false&ICBcDomData=UnknownValue&ICPanelHelpUrl=&ICPanelName=&ICFind=&ICAddCount=&ICAppClsData=&CLASS_SRCH_WRK2_INSTITUTION$31$=UTDAL&CLASS_SRCH_WRK2_STRM$35$=2228&SSR_CLSRCH_WRK_SUBJECT_SRCH$0=${courseCode}&SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1=E&SSR_CLSRCH_WRK_CATALOG_NBR$1=&SSR_CLSRCH_WRK_ACAD_CAREER$2=&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$3=N&SSR_CLSRCH_WRK_OEE_IND$chk$4=N&SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5=GE&SSR_CLSRCH_WRK_MEETING_TIME_START$5=&SSR_CLSRCH_WRK_SSR_END_TIME_OPR$5=LE&SSR_CLSRCH_WRK_MEETING_TIME_END$5=&SSR_CLSRCH_WRK_INCLUDE_CLASS_DAYS$6=I&SSR_CLSRCH_WRK_SUN$chk$6=&SSR_CLSRCH_WRK_MON$chk$6=&SSR_CLSRCH_WRK_TUES$chk$6=&SSR_CLSRCH_WRK_WED$chk$6=&SSR_CLSRCH_WRK_THURS$chk$6=&SSR_CLSRCH_WRK_FRI$chk$6=&SSR_CLSRCH_WRK_SAT$chk$6=&SSR_CLSRCH_WRK_SSR_EXACT_MATCH2$7=B&SSR_CLSRCH_WRK_LAST_NAME$7=&SSR_CLSRCH_WRK_CLASS_NBR$8=&SSR_CLSRCH_WRK_DESCR$9=&SSR_CLSRCH_WRK_SSR_UNITS_MIN_OPR$10=GE&SSR_CLSRCH_WRK_UNITS_MINIMUM$10=&SSR_CLSRCH_WRK_SSR_UNITS_MAX_OPR$10=LE&SSR_CLSRCH_WRK_UNITS_MAXIMUM$10=99&SSR_CLSRCH_WRK_SSR_COMPONENT$11=&SSR_CLSRCH_WRK_SESSION_CODE$12=&SSR_CLSRCH_WRK_INSTRUCTION_MODE$13=&SSR_CLSRCH_WRK_CAMPUS$14=&SSR_CLSRCH_WRK_LOCATION$15=&SSR_CLSRCH_WRK_CRSE_ATTR$16=&SSR_CLSRCH_WRK_CRSE_ATTR_VALUE$16=`;

const getCourseData = async (courseCode) => {
    const cacheKey = `utd-courseList-${courseCode}`;
    let requestXml = await getFromCache(cacheKey);

    if(!requestXml) {
        console.log("cache not defined");
        const icyPos = 0;
        const request = await fetch("https://dacs-prd.utshare.utsystem.edu/psc/DACSPRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                "sec-ch-ua-e": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": otherCookies.join(";") + "; " + expireCookie,
                "Referer": "https://dacs-prd.utshare.utsystem.edu/psc/DACSPRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL?Page=SSR_CLSRCH_ENTRY&Action=U&ACAD_CAREER=CAR&EMPLID=2021605453&ENRL_REQUEST_ID=&INSTITUTION=INST&STRM=TERM",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": getBody(courseCode, icyPos, icStateNum),
            "method": "POST"
        });
        if (!request.ok) {
            throw new Error(`Request ${courseCode} ${icStateNum} failed ${request.status}`);
        }

        requestXml = await request.text();

        if(isUnauthenticated(requestXml)){
            throw new Error("Unauthenticated, check cookie");
        }

        const cookieHeaders = request.headers.raw()['set-cookie'];
        const newExpireToken = cookieHeaders.find((cookie) => cookie.startsWith('PS_TOKENEXPIRE='));
        const newExpireCookie = newExpireToken.split(';')[0];
        console.log(`Updating expire cookie ${expireCookie} to ${newExpireCookie}`);
        expireCookie = newExpireCookie;
        await saveCookie(otherCookies.join(";") + "; " + expireCookie);
    }


    try {
        const classList = xmlToClassList(requestXml);
        await saveToCache(cacheKey, classList);

        icStateNum++;
        console.log(classList);

        return classList;
    }catch(e) {
        if(e instanceof ICStateStaleError){
            console.log(`Failed to get course data for ${courseCode} because of IC state num ${icStateNum}`);
            icStateNum++;
            return await getCourseData();
        }else{
            throw e;
        }
    }
};

getCourseData("ACTS");

// write request to acts2.xml
// await streamPipeline(request.body, createWriteStream('acts2.xml'));
