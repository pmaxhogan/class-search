import {createWriteStream} from 'node:fs';
import * as fs from 'node:fs/promises';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';
import {XMLParser} from 'fast-xml-parser';
import { strict as assert } from 'node:assert';

import {getFromCache, saveToCache} from './cache.js';
import {xmlToClassList, ICStateStaleError, isUnauthenticated, NeedsConfirmationError} from "./xmlToClassList.js";
import {loadCookie, saveCookie} from "./cookie.js";

const streamPipeline = promisify(pipeline);

const {cookie: starterCookie, icStateNum: starterIcStateNum, sessionId} = await loadCookie();


if(!starterCookie || !starterIcStateNum || !sessionId){
    await saveCookie({
        sessionId: "SESSION ID GOES HERE",
        cookie: "COOKIES GO HERE",
        icStateNum: 0
    });
    throw new Error('No cookie found');
}

const starterCookies = starterCookie.split(";").map(cookie => cookie.trim());
let expireCookie = starterCookies.find(cookie => cookie.startsWith("PS_TOKENEXPIRE="));
const otherCookies = starterCookies.filter(cookie => !cookie.startsWith("PS_TOKENEXPIRE="));
let icStateNum = starterIcStateNum;


const getBody = async (courseCode, icyPos, icStateNum, isAfterConfirmation) =>
{
    const icAction = isAfterConfirmation ? "%23ICSave" : "CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH";
    const clsData = isAfterConfirmation ? "" : `&CLASS_SRCH_WRK2_INSTITUTION$31$=UTDAL&CLASS_SRCH_WRK2_STRM$35$=2228&SSR_CLSRCH_WRK_SUBJECT_SRCH$0=${courseCode}&SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1=E&SSR_CLSRCH_WRK_CATALOG_NBR$1=&SSR_CLSRCH_WRK_ACAD_CAREER$2=&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$3=N&SSR_CLSRCH_WRK_OEE_IND$chk$4=N&SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5=GE&SSR_CLSRCH_WRK_MEETING_TIME_START$5=&SSR_CLSRCH_WRK_SSR_END_TIME_OPR$5=LE&SSR_CLSRCH_WRK_MEETING_TIME_END$5=&SSR_CLSRCH_WRK_INCLUDE_CLASS_DAYS$6=I&SSR_CLSRCH_WRK_SUN$chk$6=&SSR_CLSRCH_WRK_MON$chk$6=&SSR_CLSRCH_WRK_TUES$chk$6=&SSR_CLSRCH_WRK_WED$chk$6=&SSR_CLSRCH_WRK_THURS$chk$6=&SSR_CLSRCH_WRK_FRI$chk$6=&SSR_CLSRCH_WRK_SAT$chk$6=&SSR_CLSRCH_WRK_SSR_EXACT_MATCH2$7=B&SSR_CLSRCH_WRK_LAST_NAME$7=&SSR_CLSRCH_WRK_CLASS_NBR$8=&SSR_CLSRCH_WRK_DESCR$9=&SSR_CLSRCH_WRK_SSR_UNITS_MIN_OPR$10=GE&SSR_CLSRCH_WRK_UNITS_MINIMUM$10=&SSR_CLSRCH_WRK_SSR_UNITS_MAX_OPR$10=LE&SSR_CLSRCH_WRK_UNITS_MAXIMUM$10=99&SSR_CLSRCH_WRK_SSR_COMPONENT$11=&SSR_CLSRCH_WRK_SESSION_CODE$12=&SSR_CLSRCH_WRK_INSTRUCTION_MODE$13=&SSR_CLSRCH_WRK_CAMPUS$14=&SSR_CLSRCH_WRK_LOCATION$15=&SSR_CLSRCH_WRK_CRSE_ATTR$16=&SSR_CLSRCH_WRK_CRSE_ATTR_VALUE$16=`;

    const str = `ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=${icStateNum}&ICAction=${icAction}&ICModelCancel=0&ICXPos=0&ICYPos=${icyPos}&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICSkipPending=0&ICAutoSave=0&ICResubmit=0&ICSID=${sessionId}%3D&ICActionPrompt=false&ICBcDomData=UnknownValue&ICPanelHelpUrl=&ICPanelName=&ICFind=&ICAddCount=&ICAppClsData=${clsData}`;

    return str;
}

const getCourseData = async (courseCode, afterConfirmation = false) => {
    const cacheKey = `utd-courseList-${courseCode}`;
    let requestXml = await getFromCache(cacheKey);
    const wasFromCache = !!requestXml;
    console.log(`searching for course data ${courseCode} ${requestXml ? "from cache" : "from server"}, ${afterConfirmation} @@ ${icStateNum}`);

    if(!requestXml) {
        console.log("cache not defined ", afterConfirmation, icStateNum);

        const newSearchReq = await fetch("https://dacs-prd.utshare.utsystem.edu/psc/DACSPRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": otherCookies.join("; ") + "; " + expireCookie,
                "Referer": "https://dacs-prd.utshare.utsystem.edu/psc/DACSPRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL?Page=SSR_CLSRCH_ENTRY&Action=U",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=${icStateNum}&ICAction=CLASS_SRCH_WRK2_SSR_PB_NEW_SEARCH&ICModelCancel=0&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICSkipPending=0&ICAutoSave=0&ICResubmit=0&ICSID=OCavbCMWQJROBNA1wchMtCmxq2Z4jO2VGIeparLYu08%3D&ICActionPrompt=false&ICBcDomData=UnknownValue&ICPanelHelpUrl=&ICPanelName=&ICFind=&ICAddCount=&ICAppClsData=`,
            "method": "POST"
        });
        icStateNum ++;
        const newSearchText = await newSearchReq.text();
        try {
            await xmlToClassList(newSearchText, icStateNum);
        }catch(e){
            if(e instanceof ICStateStaleError && e.newNum){
                icStateNum = e.newNum;
                console.log("immediate new state ", e.newNum);
                return await getCourseData(courseCode, false);
            }
        }



        const icyPos = 0;
        const options = {
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
                "cookie": otherCookies.join("; ") + "; " + expireCookie,
                "Referer": "https://dacs-prd.utshare.utsystem.edu/psc/DACSPRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL?Page=SSR_CLSRCH_ENTRY&Action=U&ACAD_CAREER=CAR&EMPLID=2021605453&ENRL_REQUEST_ID=&INSTITUTION=INST&STRM=TERM",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": await getBody(courseCode, icyPos, icStateNum, afterConfirmation),
            "method": "POST"
        };
        const request = await fetch("https://dacs-prd.utshare.utsystem.edu/psc/DACSPRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL", options);

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
        await saveCookie({
            cookie: otherCookies.join("; ") + "; " + expireCookie,
            icStateNum,
            sessionId,
        });

        icStateNum++;
    }


    try {
        const classList = xmlToClassList(requestXml, icStateNum, wasFromCache);
        await saveToCache(cacheKey, requestXml);

        return classList;
    }catch(e) {
        if(e instanceof ICStateStaleError){
            console.log(`Failed to get course data for ${courseCode} because of IC state num ${icStateNum - 1} ${e.newNum}`);
            if(e.newNum) icStateNum = e.newNum;
            return await getCourseData(courseCode);
        }else if (e instanceof NeedsConfirmationError){
            return await getCourseData(courseCode, true);
        }else{
            throw e;
        }
    }
};

const results = await getCourseData("BLAW");
console.log(results.length, results[0]);
// console.log((await getCourseData("ARAB")));

// write request to acts2.xml
// await streamPipeline(request.body, createWriteStream('acts2.xml'));
