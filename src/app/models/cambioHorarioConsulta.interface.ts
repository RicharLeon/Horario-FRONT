export interface CambioHorarioConsultaInterface {
    idCambioHorario?: Number,
    idEmpleadoSolicitante?: Number,
    nombreEmpleadoSolicitante?: String,
    idEmpleadoAprobador?: Number,
    nombreEmpleadoAprobador?: String,
    idEmpleadoCambio?: Number,
    nombreEmpleadoCambio?: String,
    estado?: boolean,
    descripcion?: String
}