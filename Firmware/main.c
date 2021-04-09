#include "include.h"

//U99 reserved as null shared write
//
#define INT_MAX 0x7FFFFFFF
//
//
//
#define BUS_A_MAIN 2200
#define BUS_B_MAIN 2700

#define BUS_A_MISC 2300
#define BUS_B_MISC 2800

#define BUS_ITEM_LEN 2
#define BUS_A_LEN 4
#define BUS_B_LEN 4

#define BUS_ITEM_MAIN 0
#define BUS_ITEM_MISC 1

#define AD_LEN 8
#define AD_RAW 431
#define AD_VALUE 311
#define AD_NAME 343
#define AD_UNIT 375
//
//
//
#define RELAY_ADDR 231
#define RELAY_NUM 6
#define RULE_NUM 10

#define RULE_START 0
#define RULE_END 1

#define RULE_TYPE 0
#define RULE_TARGET 1
#define RULE_SUB_A 2
#define RULE_SUB_B 3

#define RULE_LEN 6
#define RULE_RANGE_LEN 2
#define RULE_INFO_LEN 4

#define RELAY_ON 512
#define RELAY_OFF 256

#define TYPE_NONE 0     //NONE
#define TYPE_TIME 1     //time based
#define TYPE_BUS_MAIN 2 //temperature sensor
#define TYPE_BUS_MISC 3 //temperature sensor
#define TYPE_CPWM 4     //Custom PWM
//
//
//
#define NAME_MAX_LEN 24
//
//
//
#define NTP_IP SDS_get_u32(43)
//
//
//
#define DATE_YEAR SDS_get_u32(7)
#define DATE_MONTH SDS_get_u32(6)
#define DATE_DAY SDS_get_u32(5)
#define DATE_HOUR SDS_get_u32(8)
#define DATE_MINUTE SDS_get_u32(9)
#define DATE_SECOND SDS_get_u32(10)

#define DATE_TODAYSECONDS DATE_HOUR * 3600 + DATE_MINUTE * 60 + DATE_SECOND
#define DATE_UTC_NOW SDS_get_u32(4)
//
//
//
#define PRINT_DATE printf("[%u.%u.%u %02u:%02u:%02u] ", DATE_DAY, DATE_MONTH, DATE_YEAR, DATE_HOUR, DATE_MINUTE, DATE_SECOND)
#define PRINT_MESSAGE(message) printf("[%u.%u.%u %02u:%02u:%02u] <b>%s</b>\n", DATE_DAY, DATE_MONTH, DATE_YEAR, DATE_HOUR, DATE_MINUTE, DATE_SECOND, message)

unsigned int U00 = RULE_NUM;       //num of rules
unsigned int U01 = RULE_RANGE_LEN; //rule range len
unsigned int U02 = RULE_INFO_LEN;  //rule info len
unsigned int U03 = 31;             //rule ranges start
unsigned int U04 = 21;             //rule infos start

//U10 - time
unsigned int U10;

//U12-U17 - relay states
unsigned int U11;
unsigned int U12;
unsigned int U13;
unsigned int U14;
unsigned int U15;
unsigned int U16;

//T01-T04 - bus A names
char T01[NAME_MAX_LEN] = "small sensor 1";
char T02[NAME_MAX_LEN] = "small sensor 2";
char T03[NAME_MAX_LEN];
char T04[NAME_MAX_LEN];
char *bus_a_names[BUS_A_LEN] = {
    &T01,
    &T02,
    &T03,
    &T04,
};

//T11-T14 - bus B names
char T11[NAME_MAX_LEN] = "2m temp";
char T12[NAME_MAX_LEN];
char T13[NAME_MAX_LEN];
char T14[NAME_MAX_LEN];
char *bus_b_names[BUS_B_LEN] = {
    &T11,
    &T12,
    &T13,
    &T14,
};

//T21-T30 - rule names
char T21[NAME_MAX_LEN] = "Rule 1";
char T22[NAME_MAX_LEN] = "Rule 2";
char T23[NAME_MAX_LEN] = "Rule 3";
char T24[NAME_MAX_LEN] = "Rule 4";
char T25[NAME_MAX_LEN] = "Rule 5";
char T26[NAME_MAX_LEN] = "Rule 6";
char T27[NAME_MAX_LEN] = "Rule 7";
char T28[NAME_MAX_LEN] = "Rule 8";
char T29[NAME_MAX_LEN] = "Rule 9";
char T30[NAME_MAX_LEN] = "Rule 10";
char *rule_names[RULE_NUM] = {
    &T21,
    &T22,
    &T23,
    &T24,
    &T25,
    &T26,
    &T27,
    &T28,
    &T29,
    &T30,
};

//T31-T36 - relay names
char T31[NAME_MAX_LEN];
char T32[NAME_MAX_LEN];
char T33[NAME_MAX_LEN];
char T34[NAME_MAX_LEN];
char T35[NAME_MAX_LEN];
char T36[NAME_MAX_LEN];
char *relay_name[RELAY_NUM] = {
    &T31,
    &T32,
    &T33,
    &T34,
    &T35,
    &T36,
};

//T41-T48 - analog names
char T41[NAME_MAX_LEN];
char T42[NAME_MAX_LEN];
char T43[NAME_MAX_LEN];
char T44[NAME_MAX_LEN];
char T45[NAME_MAX_LEN];
char T46[NAME_MAX_LEN];
char T47[NAME_MAX_LEN];
char T48[NAME_MAX_LEN];
char *analog_names[AD_LEN] = {
    &T41,
    &T42,
    &T43,
    &T44,
    &T45,
    &T46,
    &T47,
    &T48,
};

//T50-T57 - analog unit names
char T50[NAME_MAX_LEN];
char T51[NAME_MAX_LEN];
char T52[NAME_MAX_LEN];
char T53[NAME_MAX_LEN];
char T54[NAME_MAX_LEN];
char T55[NAME_MAX_LEN];
char T56[NAME_MAX_LEN];
char T57[NAME_MAX_LEN];

//S11-S18 - bus A
int S11;
int S12;
int S13;
int S14;
int S15;
int S16;
int S17;
int S18;
int *bus_a[BUS_A_LEN * BUS_ITEM_LEN] = {
    &S11,
    &S12,
    &S13,
    &S14,
    &S15,
    &S16,
    &S17,
    &S18,
};
//S21-S28 - bus B
int S21;
int S22;
int S23;
int S24;
int S25;
int S26;
int S27;
int S28;
int *bus_b[BUS_B_LEN * BUS_ITEM_LEN] = {
    &S21,
    &S22,
    &S23,
    &S24,
    &S25,
    &S26,
    &S27,
    &S28,
};

//S31-S50 - rule ranges (start/end)
//U21-60 - rule infos (type/target/subA/subB)
int S31 = 1800;                   //start
int S32 = 3000;                   //end
unsigned int U21 = TYPE_BUS_MAIN; //type
unsigned int U22 = BUS_A_LEN + 0; //target
unsigned int U23 = 1;             //subRuleA
unsigned int U24 = INT_MAX;       //subRuleB

int S33 = 1000;                   //start
int S34 = 2800;                   //end
unsigned int U25 = TYPE_BUS_MAIN; //type
unsigned int U26 = BUS_A_LEN + 0; //target
unsigned int U27 = INT_MAX;       //subRuleA
unsigned int U28 = INT_MAX;       //subRuleB

int S35 = 1800;                   //start
int S36 = 3000;                   //end
unsigned int U29 = TYPE_BUS_MAIN; //type
unsigned int U30 = 0;             //target
unsigned int U31 = INT_MAX;       //subRuleA
unsigned int U32 = INT_MAX;       //subRuleB

int S37 = 1800;                   //start
int S38 = 3000;                   //end
unsigned int U33 = TYPE_BUS_MAIN; //type
unsigned int U34 = 0;             //target
unsigned int U35 = INT_MAX;       //subRuleA
unsigned int U36 = INT_MAX;       //subRuleB

int S39 = 1800;                   //start
int S40 = 3000;                   //end
unsigned int U37 = TYPE_BUS_MAIN; //type
unsigned int U38 = 0;             //target
unsigned int U39 = INT_MAX;       //subRuleA
unsigned int U40 = INT_MAX;       //subRuleB

int S41 = 1800;                   //start
int S42 = 3000;                   //end
unsigned int U41 = TYPE_BUS_MAIN; //type
unsigned int U42 = 0;             //target
unsigned int U43 = INT_MAX;       //subRuleA
unsigned int U44 = INT_MAX;       //subRuleB

int S43 = 1800;                   //start
int S44 = 3000;                   //end
unsigned int U45 = TYPE_BUS_MAIN; //type
unsigned int U46 = 0;             //target
unsigned int U47 = INT_MAX;       //subRuleA
unsigned int U48 = INT_MAX;       //subRuleB

int S45 = 1800;                   //start
int S46 = 3000;                   //end
unsigned int U49 = TYPE_BUS_MAIN; //type
unsigned int U50 = 0;             //target
unsigned int U51 = INT_MAX;       //subRuleA
unsigned int U52 = INT_MAX;       //subRuleB

int S47 = 1800;                   //start
int S48 = 3000;                   //end
unsigned int U53 = TYPE_BUS_MAIN; //type
unsigned int U54 = 0;             //target
unsigned int U55 = INT_MAX;       //subRuleA
unsigned int U56 = INT_MAX;       //subRuleB

int S49 = 1800;                   //start
int S50 = 3000;                   //end
unsigned int U57 = TYPE_BUS_MAIN; //type
unsigned int U58 = 0;             //target
unsigned int U59 = INT_MAX;       //subRuleA
unsigned int U60 = INT_MAX;       //subRuleB

int *rule_ranges[RULE_NUM * RULE_RANGE_LEN] = {
    &S31,
    &S32,

    &S33,
    &S34,

    &S35,
    &S36,

    &S37,
    &S38,

    &S39,
    &S40,

    &S41,
    &S42,

    &S43,
    &S44,

    &S45,
    &S46,

    &S47,
    &S48,

    &S49,
    &S50,
};

unsigned int *rule_infos[RULE_NUM * RULE_INFO_LEN] = {
    &U21,
    &U22,
    &U23,
    &U24,

    &U25,
    &U26,
    &U27,
    &U28,

    &U29,
    &U30,
    &U31,
    &U32,

    &U33,
    &U34,
    &U35,
    &U36,

    &U37,
    &U38,
    &U39,
    &U40,

    &U41,
    &U42,
    &U43,
    &U44,

    &U45,
    &U46,
    &U47,
    &U48,

    &U49,
    &U50,
    &U51,
    &U52,

    &U53,
    &U54,
    &U55,
    &U56,

    &U57,
    &U58,
    &U59,
    &U60,
};

//array containing all the most recent rule results
unsigned int rule_cache[RULE_NUM];

//*naming after physical labeling on SDS
//U70-U75 - relay rule indexes
unsigned int U70 = INT_MAX; //relay 1
unsigned int U71 = INT_MAX; //relay 2
unsigned int U72 = INT_MAX; //relay 3
unsigned int U73 = 0;       //relay 4
unsigned int U74 = INT_MAX; //relay 5
unsigned int U75 = INT_MAX; //relay 6
unsigned int *relay_rules[] = {
    &U70,
    &U71,
    &U72,
    &U73,
    &U74,
    &U75,
};

//TODO: change to int, rename to S prefix, change len to AD_LEN * BUS_ITEM_LEN
//S60 - S75 analog raw/calculated input
int S60;
int S61;
int S62;
int S63;
int S64;
int S65;
int S66;
int S67;
int S68;
int S69;
int S70;
int S71;
int S72;
int S73;
int S74;
int S75;
int *bus_analog[AD_LEN * BUS_ITEM_LEN] = {
    &S60,
    &S61,
    &S62,
    &S63,
    &S64,
    &S65,
    &S66,
    &S67,
    &S68,
    &S69,
    &S70,
    &S71,
    &S72,
    &S73,
    &S74,
    &S75,
};

//Get current state of relay at zero based index
unsigned int relayGet(unsigned int index)
{
    return SDS_get_u32(RELAY_ADDR + index);
}
//Set current state of relay at zero based index
void relaySet(unsigned int index, unsigned int val) { SDS_set_u32(RELAY_ADDR + index, val); }

//Get n exponent of 2
unsigned int exp2(unsigned int exp)
{
    unsigned int i;
    unsigned int result = 1;
    for (i = 1; i <= exp; i++)
    {
        result *= 2;
    }
    return result;
}

//update values on bus A
void updateBusA()
{
    unsigned int j = 0;
    for (unsigned int i = 0; i < BUS_A_LEN * BUS_ITEM_LEN; i += BUS_ITEM_LEN)
    {
        *bus_a[i + BUS_ITEM_MAIN] = SDS_get_i32(BUS_A_MAIN + j);
        *bus_a[i + BUS_ITEM_MISC] = SDS_get_i32(BUS_A_MISC + j);
        j++;
    }
}

//update values on bus B
void updateBusB()
{
    unsigned int j = 0;
    for (unsigned int i = 0; i < BUS_B_LEN * BUS_ITEM_LEN; i += BUS_ITEM_LEN)
    {
        *bus_b[i + BUS_ITEM_MAIN] = SDS_get_i32(BUS_B_MAIN + j);
        *bus_b[i + BUS_ITEM_MISC] = SDS_get_i32(BUS_B_MISC + j);
        j++;
    }
}

void updateAnalog()
{
    unsigned int j = 0;
    for (unsigned int i = 0; i < AD_LEN * BUS_ITEM_LEN; i += BUS_ITEM_LEN)
    {
        *bus_analog[i] = SDS_get_u32(AD_RAW + j);
        *bus_analog[i + 1] = SDS_get_f32(AD_VALUE + j) * 100;
        j++;
    }
}

//update all values on both buses
void updateBus()
{
    updateBusA();
    updateBusB();
    updateAnalog();
}

//true if the value is in between the start and end (inverted if start > end)
int getStateByInterval(int start, int end, int value)
{
    int state = start <= value && value < end;
    if (start > end)
    {
        state = !state;
    }
    return state;
}

//evaluates if number is at the start or at the the end part of the interval
int getStateByCPWM(int start, int end, unsigned int value)
{
    return ((value % (start + end)) < start);
}

//reads from bus A if index < BUS_A_LEN other wise from bus B at (index - BUS_A_LEN) if (index - BUS_A_LEN) < BUS_B_LEN or from analog at (index - BUS_A_LEN - BUS_B_LEN)
int readFromBus(unsigned int index, unsigned int bus_item)
{
    if (index < BUS_A_LEN)
    {
        return *bus_a[(index * BUS_ITEM_LEN) + bus_item];
    }
    index -= BUS_A_LEN;
    if (index < BUS_B_LEN)
    {
        return *bus_b[((index)*BUS_ITEM_LEN) + bus_item];
    }
    index -= BUS_B_LEN;
    return *bus_analog[(index * BUS_ITEM_LEN) + bus_item];
}

//updates all rules and all relays
void updateRelaysByRules()
{
    evaluateAllRules();
    for (unsigned int i = 0; i < RELAY_NUM; i++)
    {
        unsigned int index = *relay_rules[i];
        if (index == INT_MAX)
        {
            updateRelays(RELAY_OFF + exp2(i));
        }
        else
        {
            updateRelays((rule_cache[index] ? RELAY_ON : RELAY_OFF) + exp2(i));
        }
    }
}

//log relay state to echo.htm
void printRelayChange(unsigned int index, unsigned int state)
{
    PRINT_DATE;
    if (state)
    {
        printf("Relé %u ZAP\n", index);
    }
    else
    {
        printf("Relé %u VYP\n", index);
    }
}

//updates relays using 6 bits coresponing to relay index plus 512 for ON or 256 for OFF
void updateRelays(unsigned int value)
{
    if (value < 257)
    {
        value = 0;
        return;
    }
    unsigned int state = value > 512 ? 0xFF : 0;
    if (value & 1)
    {
        if (relayGet(0) != state)
        {
            relaySet(0, state);
            U11 = state;
            printRelayChange(1, state);
        }
    }
    if (value & 2)
    {
        if (relayGet(1) != state)
        {
            relaySet(1, state);
            U12 = state;
            printRelayChange(2, state);
        }
    }
    if (value & 4)
    {
        if (relayGet(2) != state)
        {
            relaySet(2, state);
            U13 = state;
            printRelayChange(3, state);
        }
    }
    if (value & 8)
    {
        if (relayGet(3) != state)
        {
            relaySet(3, state);
            U14 = state;
            printRelayChange(4, state);
        }
    }
    if (value & 16)
    {
        if (relayGet(4) != state)
        {
            relaySet(4, state);
            U15 = state;
            printRelayChange(5, state);
        }
    }
    if (value & 32)
    {
        if (relayGet(5) != state)
        {
            relaySet(5, state);
            U16 = state;
            printRelayChange(6, state);
        }
    }

    U15 = 0;
}

//evaluates single rule at index, used should be pointer to variable of initial value 0
unsigned int evaluateRule(unsigned int index, unsigned int *used)
{
    //infinite loop protection
    unsigned int exp = exp2(index);
    if (*used & exp)
    {
        return rule_cache[index];
    }
    *used |= exp;

    //current rule evaluation

    unsigned int rangeIndex = index * RULE_RANGE_LEN;
    unsigned int infoIndex = index * RULE_INFO_LEN;
    unsigned int returnValue;
    int value;
    int start = *rule_ranges[rangeIndex + RULE_START];
    int end = *rule_ranges[rangeIndex + RULE_END];
    unsigned int target_index = *rule_infos[infoIndex + RULE_TARGET];
    switch (*rule_infos[infoIndex + RULE_TYPE])
    {
    case TYPE_TIME:
        returnValue = getStateByInterval(start, end, DATE_TODAYSECONDS);
        break;
    case TYPE_BUS_MAIN:
        value = readFromBus(target_index, BUS_ITEM_MAIN);
        returnValue = getStateByInterval(start, end, value);
        break;
    case TYPE_BUS_MISC:
        value = readFromBus(target_index, BUS_ITEM_MISC);
        returnValue = getStateByInterval(start, end, value);
        break;
    case TYPE_CPWM:
        returnValue = getStateByCPWM(start, end, DATE_UTC_NOW);
        break;
    case TYPE_NONE:
    default:
        returnValue = 0;
        break;
    }
    rule_cache[index] = returnValue;

    //sub rules evaluation
    if (returnValue)
    {
        if (*rule_infos[infoIndex + RULE_SUB_A] < RULE_NUM)
        {
            returnValue = returnValue && evaluateRule(*rule_infos[infoIndex + RULE_SUB_A], used);
        }
        if (returnValue && *rule_infos[infoIndex + RULE_SUB_B] < RULE_NUM)
        {
            returnValue = returnValue && evaluateRule(*rule_infos[infoIndex + RULE_SUB_B], used);
        }
    }

    rule_cache[index] = returnValue;
    return returnValue;
}

//evaluates all rules
void evaluateAllRules()
{
    unsigned int used = 0;
    for (unsigned int i = 0; i < RULE_NUM; i++)
    {
        evaluateRule(i, &used);
    }
}

//TODO
void saveToDf(int *buffer, unsigned int size, unsigned int page)
{
    if (size > 264)
    {
        size = 264;
    }
    int data[264];

    for (unsigned int i = 0; i < size; i++)
    {
        data[i] = buffer[i];
    }
    DF_write_page(page, data);
}

void main()
{
    PRINT_MESSAGE("Program started");

    PRINT_DATE;
    printf("UTC: %u\n", DATE_UTC_NOW);
    PRINT_DATE;
    printf("Today seconds: %u\n", DATE_TODAYSECONDS);

    PRINT_DATE;
    printf("GMT:%u\n", SDS_get_i32(26));
    PRINT_DATE;
    printf("DST:%u\n", SDS_get_i32(65));

    PRINT_DATE;
    printf("NTP server: %u.%u.%u.%u\n", NTP_IP & 0xFF, (NTP_IP >> 8) & 0xFF, (NTP_IP >> 16) & 0xFF, (NTP_IP >> 24) & 0xFF);

    for (unsigned int i = 0; i < AD_LEN; i++)
    {
        SDS_get_a(AD_NAME + i, analog_names[i], NAME_MAX_LEN);
    }

    U11 = relayGet(0);
    U12 = relayGet(1);
    U13 = relayGet(2);
    U14 = relayGet(3);
    U15 = relayGet(4);
    U16 = relayGet(5);

    while (1)
    {
        U10 = DATE_UTC_NOW;
        updateBus();
        updateRelaysByRules(); //rules
    }
    PRINT_MESSAGE("ERROR!");
}