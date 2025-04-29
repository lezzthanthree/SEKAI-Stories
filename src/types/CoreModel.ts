export interface CoreModel {
    _parameterIds: string[];
    _parameterMaximumValues: number[];
    _parameterMinimumValues: number[];
    _parameterValues: number[];
    getParameterMaximumValue: (idx: number) => number;
    getParameterMinimumValue: (idx: number) => number;
    getParameterValueById: (id: string) => number;
    setParameterValueById: (
        parameterId: string,
        value: number,
        weight?: number
    ) => void;
}
