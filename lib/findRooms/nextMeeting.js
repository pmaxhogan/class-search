import {DAYS_TYPES} from "../consts.js";

const nextMeeting = (section, referenceTime) => {
    if(!referenceTime) referenceTime = new Date();

    switch(section.days.type) {
        case DAYS_TYPES.NONE:
            return null;
        case DAYS_TYPES.ONCE:
            return section.days.when;
        case DAYS_TYPES.RECURRING:
            return null;
    }
};
