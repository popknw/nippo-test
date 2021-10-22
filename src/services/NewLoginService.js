import history from "../history";
import { RouteName } from "../models/route_name";


export default async function NewLogin() {
    await localStorage.removeItem('token');
    history.push(RouteName.LOGIN);

}

