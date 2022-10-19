// ** Core JWT Import
import useJwt from "@src/@core/auth/jwt/useJwt"

import jwtConfig from "./jwtConfig"

const { jwt } = useJwt(jwtConfig)

export default jwt
