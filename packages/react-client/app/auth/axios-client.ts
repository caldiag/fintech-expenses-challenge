import axios from "axios"
import { serverUrl } from "~/lib/server-url"

//uses httpOnly cookies
export default axios.create({ baseURL: serverUrl(), withCredentials: true })
