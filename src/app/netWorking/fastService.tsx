import { Environment } from "../environment";
import { _getToken } from "./authService";

let url = Environment.apiPost;
export const getBudgetPlanningFast = async (_year: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Report/GetBudgetPlanningFast', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                Year: _year
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}
export const getSupplier = async (StringDateFrom:string,StringDateTo:string,SupplierCode:string) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Report/GetSupplier', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                StringDateFrom,
                StringDateTo,
                SupplierCode
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}