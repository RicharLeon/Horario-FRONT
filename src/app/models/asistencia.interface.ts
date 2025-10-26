export interface AsistenciaInterface {
    idAsistencia?: Number,
    idEmpleado?: Number,
    fechaAsistencia?: Date | string,
    fechaActualizacion?: Date | string,
    estadoAsistencia?: String
}

export interface AsistenciaCreateInterface {
    idEmpleado: Number,
    fechaAsistencia: Date | string,
    estadoAsistencia: String
}
