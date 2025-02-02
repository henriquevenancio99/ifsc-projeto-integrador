export interface IWorkShift {
  startTime: string;
  endTime: string;
}

export interface IScheduling {
  id: string;
  start: string;
  end: string;
  clientId: string;
  employeesIds: string[];
  salonServicesIds: string[];
}

export interface ISchedulerState {
  schedulingSelected?: IScheduling;
  clientSelectd?: Record<string, string>;
  employeesSelected?: { value: string; label: string }[];
  salonServicesSelected?: { value: string; label: string }[];
  rangeSelected?: { start: string; end: string };
}
