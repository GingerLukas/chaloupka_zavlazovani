export enum RuleType {
    NONE = 0,
    TIME = 1,
    BUS_MAIN = 2,
    BUS_MISC = 3,
    CPWM = 4,

    rule_none = 0,
    rule_time = 1,
    rule_temp = 2,
    rule_humi = 3,
    rule_cpwm = 4,

}
export enum RelayIndexes {
    TEXT = 0,
    RULE = 1,
    STATE = 2,
}

export enum SaveTarget {
    ALL = 0,
    SENSOR = 1,
    RULE = 2,
    RELAY = 3,
    MAIL = 4,
}