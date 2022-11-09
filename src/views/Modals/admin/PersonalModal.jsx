import React, { useEffect, useState } from "react";

import {
    Button,
    TabPane,
    TabContent,
    NavLink,
    NavItem,
    Nav,
    Form,
    FormGroup,
    Modal,
    Row,
    Col
} from "reactstrap";
import { useForm } from "react-hook-form"
import { PostRoute } from '../../../services/Private'
import Select from 'react-select'
import { OptionsToast } from 'variables';
import { toast } from 'react-toastify'

const PersonalModal = ({ modalOpen, toggleModal, information, setInformation, opcion, puestosSelect, ListPersonal }) => {

    const nameController = "Personas"
    const personasLaboralController = "PersonasLaboral"
    const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset, setValue } = useForm(),

        [active, setActive] = useState("1"),
        [genero, setGenero] = useState(null),
        [estadoCivil, setEstadoCivil] = useState(null),
        [puesto, setPuesto] = useState(null),
        [WarningPuesto, setWarningPuesto] = useState(false),
        [edadCalculada, setEdadCalculada] = useState(''),
        optionsGenero = [{ value: 0, label: 'Masculino' }, { value: 1, label: 'Femenino' }],
        optionsEstadoCivil = [{ value: 'Soltero (a)', label: 'Soltero (a)' }, { value: 'Casado (a)', label: 'Casado (a)' }, { value: 'Divorciado (a)', label: 'Divorciado (a)' }, { value: 'Viudo (a)', label: 'Viudo (a)' }],
        wFNacimiento = watch('fechaNacimiento'),
        nextTab = (e) => {
            setActive(e)
        },
        onChangeEstadoCivil = (data) => {
            setEstadoCivil(data)
        },
        onChangePuesto = (data) => {
            if (data) {
                setWarningPuesto(false)
            } else {
                setWarningPuesto(true)
            }
            setPuesto(data)
        },
        onChangeGenero = (data) => {
            setGenero(data)
        },
        StoreUpdate = async (data, id) => {
            let response = []
            response = await PostRoute(`${nameController}/${!id ? 'create' : 'update'}`, data)
            if (response[0]) {

                const json = { ...response[0], ...data };
                // toast.success(response.message, OptionsToast)
                // ListPersonal()
                // toggleModal(null, 0)
                // setEdadCalculada('')
                // setGenero(null)
                // setEstadoCivil(null)
                setInformation(json)
                setActive("2")
            } else {
                toast.warning("No se logró realizar el registro.", OptionsToast)
            }
            // reset()
        },
        StoreUpdateDatoLaboral = async (data, id) => {
            let response = []
            console.log(data)
            response = await PostRoute(`${!id ? personasLaboralController : nameController}/${!id ? 'create' : 'update'}`, data)
            if (response[0]) {

                toast.success(response.message, OptionsToast)
                ListPersonal()
                toggleModal(null, 0)
                setEdadCalculada('')
                setGenero(null)
                setPuesto(null)
                setEstadoCivil(null)
                setInformation("")
                setActive("1")
                reset()
            } else {
                toast.warning("No se logró realizar el registro.", OptionsToast)
            }
        },

        onSubmit = (data) => {
            if (active === "2" || active === 2) {
                if (puesto) {

                    const json = { idPuesto: puesto.value, idPersona: information.id, id: information.id }
                    const request = { ...json, ...data }

                    StoreUpdateDatoLaboral(request, opcion === 3 ? (information ? information.id : null) : null)
                } else {
                    setWarningPuesto(true)
                }
            } else {
                const json = { genero: genero.value, estadoCivil: estadoCivil.value }
                const request = { ...json, ...data }
                StoreUpdate(request, null)
                clearErrors()
            }
        },
        setData = async () => {
            await setValue('nombre3', information.nombre3)
            await setValue('nombre1', information.nombre1)
            await setValue('nombre2', information.nombre2)
            await setValue('apellido1', information.apellido1)
            await setValue('apellido2', information.apellido2)
            await setValue('apellido3', information.apellido3)
            await setValue('banco', information.banco)
            await setValue('correo', information.correo)
            await setValue('dpi', information.dpi)
            await setValue('edad', information.edad)
            await setValue('fechaIngreso', information.fechaIngreso)
            await setValue('fechaNacimiento', information.fechaNacimiento)
            await setValue('nacionalidad', information.nacionalidad)
            await setValue('nit', information.nit)
            await setValue('noCuenta', information.noCuenta)
            await setValue('residencia', information.residencia)
            await setValue('telefono', information.telefono)
            await setValue('tipoCuenta', information.tipoCuenta)

            await setValue('codigo', information.codigo)
            // await setValue('nombre', information.nombre)
            await setValue('bonoProductivo', information.bonoProductivo)
            await setValue('salarioBase', information.salarioBase)
            await setGenero({ value: information.idGenero, label: information.genero })
            await setPuesto({ value: information.idPuestos, label: information.puesto })
            await setEstadoCivil({ value: information.estadoCivil, label: information.estadoCivil })
        }


    useEffect(() => {
        if (wFNacimiento) {
            const Fecha = new Date(wFNacimiento)
            const start = Date.now();
            const start2 = new Date(start)

            const startY = (start2.getFullYear())
            const startM = (start2.getMonth() + 1)
            const startD = (start2.getDate())

            if (Fecha !== null) {

                const fnY = (Fecha.getFullYear())
                const fnM = (Fecha.getMonth() + 1)
                const fnD = (Fecha.getDate() + 1)
                // const fechaInicio = `${(Fecha.getFullYear())}-${Fecha.getMonth() + 1}-${Fecha.getDate() + 1}`
                let anioNew = startY - fnY
                if (fnM > startM) {
                    anioNew--;
                } else {
                    if (fnD > startD) {
                        anioNew--;
                    }
                }

                // console.log(anioNew)
                setEdadCalculada(anioNew)
            }
        }
    }, [wFNacimiento])

    useEffect(
        () => {
            async function fetchMyAPI() {
                if (await opcion > 1 && information) {
                    await setData()
                } else {
                    // setInformation(null)
                    // setGenero(null)
                    // setPuesto(null)
                    // setEstadoCivil(null)
                    // console.log('aca')
                    if (information?.username) {

                        reset()
                    }
                    clearErrors()
                }
            }
            fetchMyAPI()

        }, [opcion, information]
    )
    return (
        <>
            <Modal
                isOpen={modalOpen}
                toggle={function noRefCheck(e) { toggleModal(null, 0); clearErrors(); setEdadCalculada('') }}
                className="modal-dialog-centered"
                size="xl"
            >
                <Form onSubmit={(opcion !== 2) ? handleSubmit(onSubmit) : () => toggleModal(null, 0)}>

                    <div className="modal-header pb-0">
                        <h3 className="modal-title" id="modalOpenLabel">
                            {opcion === 1 && 'Crear '}Personal
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={function noRefCheck(e) { toggleModal(null, 0); setEdadCalculada(''); reset() }}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    active={active === "1"}
                                    className=""
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => nextTab("1")}
                                >
                                    Paso 1
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    active={active === "2"}
                                    style={{ cursor: 'pointer' }}
                                    className=""
                                    disabled={(opcion === 1 && !information)}
                                    onClick={() => nextTab("2")}
                                >
                                    Paso 2
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={active}>
                            <TabPane tabId='1'>
                                <Row className="mt-2">
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Primer Nombre*</p>
                                            <input
                                                id="nombre1"
                                                name="nombre1"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                className="form-control"
                                                defaultValue={information ? information.nombre1 : ''}
                                                {...register('nombre1', { required: 'Este campo es requerido.' })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.nombre1 && <><i className="fas fa-exclamation-circle"></i> {errors.nombre1.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Segundo Nombre</p>
                                            <input
                                                id="nombre2"
                                                name="nombre2"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.nombre2 : ''}
                                                className="form-control"
                                                {...register('nombre2')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Tercer Nombre</p>
                                            <input
                                                id="nombre3"
                                                name="nombre3"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.nombre3 : ''}
                                                className="form-control"
                                                {...register('nombre3')}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Primer Apellido*</p>
                                            <input
                                                id="apellido1"
                                                name="apellido1"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.apellido1 : ''}
                                                className="form-control"
                                                {...register('apellido1', { required: 'Este campo es requerido.' })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.apellido1 && <><i className="fas fa-exclamation-circle"></i> {errors.apellido1.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Segundo apellido</p>
                                            <input
                                                id="apellido2"
                                                name="apellido2"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                className="form-control"
                                                defaultValue={information ? information.apellido2 : ''}
                                                {...register('apellido2')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Apellido de casada</p>
                                            <input
                                                id="apellido3"
                                                name="apellido3"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.apellido3 : ''}
                                                className="form-control"
                                                {...register('apellido3')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Fecha de Nacimiento</p>
                                            <input
                                                id="fechaNacimiento"
                                                name="fechaNacimiento"
                                                type="date"
                                                autoComplete="off"
                                                defaultValue={information ? information.fechaNacimiento : ''}
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('fechaNacimiento')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Edad*</p>
                                            <input
                                                id="edad"
                                                name="edad"
                                                autoComplete="off"
                                                defaultValue={information ? information.edad : edadCalculada}
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('edad', { pattern: { value: /^[0-9]*(\.[0-9]{0,2})?$/, message: "Sólo se admiten valores numericos" }, min: { value: 0, message: 'No se permiten valores menor a 0' } })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.edad && <><i className="fas fa-exclamation-circle"></i> {errors.edad.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Residencia</p>
                                            <input
                                                id="residencia"
                                                name="residencia"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.residencia : ''}
                                                className="form-control"
                                                {...register('residencia')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Género</p>
                                            <Select
                                                name="genero"
                                                id="genero"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="Seleccione un género"
                                                noOptionsMessage={() => "Sin resultados"}
                                                options={optionsGenero}
                                                value={genero}
                                                isClearable
                                                isDisabled={opcion === 2}
                                                onChange={onChangeGenero}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Estado Civil</p>
                                            <Select
                                                name="estadoCivil"
                                                id="estadoCivil"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="Seleccione una opción"
                                                noOptionsMessage={() => "Sin resultados"}
                                                options={optionsEstadoCivil}
                                                value={estadoCivil}
                                                isDisabled={opcion === 2}
                                                isClearable
                                                onChange={onChangeEstadoCivil}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Correo</p>
                                            <input
                                                id="correo"
                                                name="correo"
                                                autoComplete="off"
                                                type="email"
                                                defaultValue={information ? information.correo : ''}
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('correo')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Teléfono*</p>
                                            <input
                                                id="telefono"
                                                name="telefono"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.telefono : ''}
                                                className="form-control"
                                                {...register('telefono', { required: 'Este campo es requerido.', pattern: { value: /^[0-9]*(\.[0-9]{0,2})?$/, message: "Sólo se admiten valores numericos" } })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.telefono && <><i className="fas fa-exclamation-circle"></i> {errors.telefono.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>

                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Nit*</p>
                                            <input
                                                id="nit"
                                                name="nit"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.nit : ''}
                                                className="form-control"
                                                {...register('nit', { pattern: { value: /^[0-9]*(\.[0-9]{0,2})?$/, message: "Sólo se admiten valores numericos" }, min: { value: 1, message: 'No se admiten valores menor a 0.' } })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.nit && <><i className="fas fa-exclamation-circle"></i> {errors.nit.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>

                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">DPI*</p>
                                            <input
                                                id="dpi"
                                                name="dpi"
                                                autoComplete="off"
                                                defaultValue={information ? information.dpi : ''}
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('dpi', { required: 'Este campo es requerido.', minLength: { value: 13, message: 'No se ingresó un DPI correcto' }, maxLength: { value: 15, message: 'No se ingresó un DPI correcto' } })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.dpi && <><i className="fas fa-exclamation-circle"></i> {errors.dpi.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Nacionalidad</p>
                                            <input
                                                id="nacionalidad"
                                                name="nacionalidad"
                                                autoComplete="off"
                                                defaultValue={information ? information.nacionalidad : ''}
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('nacionalidad')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Número de Cuenta</p>
                                            <input
                                                id="noCuenta"
                                                name="noCuenta"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.noCuenta : ''}
                                                className="form-control"
                                                {...register('noCuenta')}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Tipo de Cuenta</p>
                                            <input
                                                id="tipoCuenta"
                                                name="tipoCuenta"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('tipoCuenta')}
                                                defaultValue={information ? information.tipoCuenta : ''}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Banco</p>
                                            <input
                                                id="banco"
                                                name="banco"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                defaultValue={information ? information.banco : ''}
                                                className="form-control"
                                                {...register('banco')}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId='2'>
                                <Row className="mt-2">
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Usuario</p>
                                            <input
                                                id="usuario"
                                                name="usuario"
                                                disabled
                                                defaultValue={information ? information.username : ''}
                                                className="form-control"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Salario Base*</p>
                                            <input
                                                id="salarioBase"
                                                name="salarioBase"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('salarioBase', { required: information ? 'Este campo es requerido.' : false, pattern: { value: /^[0-9]*(\.[0-9]{0,2})?$/, message: "Sólo se admiten valores numericos" }, min: { value: 0, message: 'No se admiten valores menor a 0.' } })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.salarioBase && <><i className="fas fa-exclamation-circle"></i> {errors.salarioBase.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Fecha de Ingreso*</p>
                                            <input
                                                id="fechaIngreso"
                                                name="fechaIngreso"
                                                type="date"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                className="form-control"
                                                {...register('fechaIngreso', { required: information ? 'Este campo es requerido.' : false, })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.fechaIngreso && <><i className="fas fa-exclamation-circle"></i> {errors.fechaIngreso.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={6} sm={12}>
                                        <FormGroup>
                                            <p className="mb-1">Puesto*</p>
                                            <Select
                                                name="puesto"
                                                id="puesto"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="Seleccione una opción"
                                                noOptionsMessage={() => "Sin resultados"}
                                                isClearable
                                                isDisabled={opcion === 2}
                                                options={puestosSelect}
                                                value={puesto}
                                                onChange={onChangePuesto}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {WarningPuesto && <><i className="fas fa-exclamation-circle"></i> Este campo es requerido</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="danger"
                            data-dismiss="modal"
                            type="button"
                            onClick={function noRefCheck(e) { toggleModal(null, 0); clearErrors(); reset(); }}
                        >
                            Salir
                        </Button>
                        {
                            opcion === 3 && <>
                                {active !== "1" &&
                                    <Button color="info" type="submit">Actualizar</Button>
                                }
                            </>
                        }
                        {
                            opcion === 1 &&

                            <Button color="primary" type="submit">Guardar</Button>

                        }

                    </div>
                </Form>
            </Modal>
        </>
    );
}

export default PersonalModal;
