export interface CambioHorarioConsultaInterface {
    idCambioHorario?: Number,
    idEmpleadoSolicitante?: Number,
    nombreEmpleadoSolicitante?: String,
    idEmpleadoAprobador?: Number,
    nombreEmpleadoAprobador?: String,
    idEmpleadoCambio?: Number,
    nombreEmpleadoCambio?: String,
    fechaSolicitud?: Date,
    estado?: boolean,
    descripcion?: String,
    mensaje?: String,
    content?: [],
    totalElements?: number
}