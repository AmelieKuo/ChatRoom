export interface RequestParams {
  data: any;
  headers: any;
  isUnLoad?: boolean;
  handleError: (error: any) => void;
}