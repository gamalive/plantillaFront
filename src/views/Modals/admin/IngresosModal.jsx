import React, { useEffect, useState } from "react";

import {
    Button,
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
import TablaDetalle from "views/admin/Componentes/TablaDetalleIngreso";
import { info } from "autoprefixer";

const IngresosModal = ({ modalOpen, DetalleFacturaController, ProductoSelect, nameController, ProveedorSelect, toggleModal, information, setInformation, opcion, ListIngresos }) => {


    const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset, setValue } = useForm(),
        [WarningProveedor, setWarningProveedor] = useState(false),
        [proveedor, setProveedor] = useState(null),
        [WarningProducto, setWarningProducto] = useState(false),
        [listDetalleFactura, setListDetalleFactura] = useState([]),
        [producto, setProducto] = useState(null),
        cantidadValue = watch('cantidadDetalle'),
        precioValue = watch('precioDetalle'),
        DateNow = async () => {
            await setValue("fechaIngreso", new Date().toISOString().slice(0, 10))
            await setValue("fechaFactura", new Date().toISOString().slice(0, 10))
        },
        ListDetalleFactura = async (id) => {
            if (!id) {
                id = (opcion > 1) ? information.idFactura : information.id;
            }
            const response = await PostRoute(`${DetalleFacturaController}/getList`, { id })
            setListDetalleFactura((response.length) ? response : [])
        },
        RequestDetalleFactura = async (data) => {
            const response = await PostRoute(`${DetalleFacturaController}/create`, data)
            const msg = (response[0] ? response[0].id : null)
            ListDetalleFactura(data.idFactura)
            return msg
        },

        StoreUpdate = async (data, id) => {
            let response = []
            response = await PostRoute(`${nameController}/${!id ? 'create' : 'update'}`, data)

            if (response[0]) {

                setInformation("")
                toast.success(`Se ha ${!id ? 'creado' : 'modificado'} el registro con éxito`, OptionsToast)
                const json = { ...response[0], ...data };
                setInformation(json)
                ListIngresos()
                // toggleModal(null, 0)
                // reset()

            } else {
                toast.warning("No se logró realizar el registro.", OptionsToast)
            }
            // reset()
        },
        AddProducto = (data) => {
            if (information) {
                if (producto) {

                    const json = {
                        idFactura: (opcion === 1) ? information.idFactura : information.id,
                        cantidad: data.cantidadDetalle,
                        precio: data.precioDetalle,
                        total: data.totalDetalle,
                        idProducto: producto.value
                    }

                    const respuesta = RequestDetalleFactura(json)
                    if (respuesta) {
                        toast.success("Se ha agregado su detalle a la factura.", OptionsToast)
                    } else {
                        toast.warning("Ha surgido un problema, intenta de nuevo.", OptionsToast)

                    }
                } else {
                    toast.warning("Producto no asignado.", OptionsToast)
                }
            }
        },
        onSubmit = (data) => {
            if (proveedor) {
                const FechaIngreso = new Date(data.fechaIngreso)
                const FechaFactura = new Date(data.fechaFactura)

                const fnY = (FechaIngreso.getFullYear()),
                    fnM = (FechaIngreso.getMonth() + 1),
                    fnD = (FechaIngreso.getDate() + 1)

                const ffnY = (FechaFactura.getFullYear()),
                    ffnM = (FechaFactura.getMonth() + 1),
                    ffnD = (FechaFactura.getDate() + 1)

                const fIngresa = fnD + "-" + fnM + "-" + fnY;
                const fFactura = ffnD + "-" + ffnM + "-" + ffnY;

                let json = {}
                json = {
                    id: (information ? information.id : null),
                    descripcion: data.descripcion,
                    monto: data.monto,
                    observacion: data.observacion,
                    fecha: fIngresa,
                    facturaModel: {
                        noFactura: data.noFactura,
                        noSerie: data.noSerie,
                        monto: data.monto,
                        observacion: data.observacion,
                        fecha: fFactura,
                        idProveedor: proveedor.value
                    }
                }
                if (information?.id) {

                    json = {
                        descripcion: data.descripcion,
                        monto: data.monto,
                        observacion: data.observacion,
                        fechaIngreso: fIngresa,
                        noFactura: data.noFactura,
                        noSerie: data.noSerie,
                        fechaFactura: fFactura,
                        idProveedor: proveedor.value,
                        id: information?.id
                    }
                }
                StoreUpdate(json, information ? information.id : null)
                // clearErrors()
            } else {
                toast.warning("Proveedor no asignado.", OptionsToast)
            }
        },
        onChangeProveedor = (data) => {
            if (data) {
                setWarningProveedor(false)
            } else {
                setWarningProveedor(true)
            }
            setProveedor(data)
        },
        onChangeProducto = (data) => {
            if (data) {
                setWarningProducto(false)
            } else {
                setWarningProducto(true)
            }
            setProducto(data)
        },
        setData = async () => {
            await setValue('fechaIngreso', information.fechaIngreso)
            await setValue('fechaFactura', information.fechaFactura)
            await setValue('descripcion', information.descripcion)
            await setValue('noFactura', information.noFactura)
            await setValue('noSerie', information.noSerie)
            await setValue('monto', information.monto)
            await setValue('observacion', information.observacion)
            await setProveedor({ value: information.idProveedor, label: information.proveedor })
        }
    useEffect(() => {
        async function fetchMyAPI() {
            if (await cantidadValue && await precioValue) {
                await setValue("totalDetalle", (cantidadValue * precioValue))
            }
        }
        fetchMyAPI()
    }, [precioValue, cantidadValue])

    useEffect(
        () => {
            async function fetchMyAPI() {
                if (await opcion > 1 && information) {
                    await setData()
                } else {
                    if (!information) {
                        reset()
                    }
                    clearErrors()
                }
                if (!information) {
                    await DateNow()
                }
                if (information) {
                    console.log(information)
                    ListDetalleFactura((opcion > 1) ? information.idFactura : information.id)
                }
            }
            fetchMyAPI()

        }, [opcion, information]
    )

    return (
        <>
            <Modal
                isOpen={modalOpen}
                toggle={function noRefCheck(e) { toggleModal(null, 0); setProveedor(null); clearErrors(); }}
                className="modal-dialog-centered"
                size="xl"
            >

                <div className="modal-header pb-0">
                    <h3 className="modal-title" id="modalOpenLabel">
                        {opcion === 1 && 'Realizar '}Ingreso
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={function noRefCheck(e) { toggleModal(null, 0); setProveedor(null); reset() }}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Form onSubmit={(opcion !== 2) ? handleSubmit(onSubmit) : () => toggleModal(null, 0)}>
                        <Row className="mt-2">
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <FormGroup>
                                    <p className="h4 text-uppercase text-muted ">Facturación</p>
                                    <hr className='invoice-spacing mt-1' />
                                </FormGroup>
                            </Col>
                            <Col lg={4} md={4} sm={6} xs={7}>
                                <FormGroup>
                                    <p className="mb-1">Fecha de Ingreso*</p>
                                    <input
                                        id="fechaIngreso"
                                        name="fechaIngreso"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        type="date"
                                        className="form-control"
                                        // defaultValue={information ? information.fechaIngreso : ""}
                                        {...register('fechaIngreso', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.fechaIngreso && <><i className="fas fa-exclamation-circle"></i> {errors.fechaIngreso.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={8} md={8} sm={6} xs={5}></Col>
                            <Col lg={12} md={12} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Descripción</p>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.descripcion : ''}
                                        {...register('descripcion')}
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}><hr className="m-2" /></Col>
                            <Col lg={4} md={4} sm={6} xs={7}>
                                <FormGroup>
                                    <p className="mb-1">Fecha de Factura*</p>
                                    <input
                                        id="fechaFactura"
                                        name="fechaFactura"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        type="date"
                                        className="form-control"
                                        // defaultValue={information ? information.fechaFactura : ''}
                                        {...register('fechaFactura', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.fechaFactura && <><i className="fas fa-exclamation-circle"></i> {errors.fechaFactura.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={8} md={8} sm={6} xs={5}></Col>

                            <Col lg={4} md={4} sm={4}>
                                <FormGroup>
                                    <p className="mb-1">No. Factura*</p>
                                    <input
                                        id="noFactura"
                                        name="noFactura"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.noFactura : ''}
                                        {...register('noFactura', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.noFactura && <><i className="fas fa-exclamation-circle"></i> {errors.noFactura.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={4} md={4} sm={4} ></Col>

                            <Col lg={4} md={4} sm={4}>
                                <FormGroup>
                                    <p className="mb-1">No. Serie*</p>
                                    <input
                                        id="noSerie"
                                        name="noSerie"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.noSerie : ''}
                                        {...register('noSerie', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.noSerie && <><i className="fas fa-exclamation-circle"></i> {errors.noSerie.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={4} md={4} sm={4}>
                                <FormGroup>
                                    <p className="mb-1">Monto*</p>
                                    <input
                                        id="monto"
                                        name="monto"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.monto : ''}
                                        {...register('monto', { required: 'Este campo es requerido.', pattern: { value: /^[0-9]*(\.[0-9]{0,2})?$/, message: "Sólo se admiten valores numericos" }, min: { value: 0, message: 'No se admiten valores menor a 0.' } })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.monto && <><i className="fas fa-exclamation-circle"></i> {errors.monto.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={4} md={4} sm={4} ></Col>
                            <Col lg={4} md={4} sm={4}>
                                <FormGroup>
                                    <p className="mb-1">Proveedor*</p>
                                    <Select
                                        name="Proveedor"
                                        id="Proveedor"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Elija un proveedor"
                                        noOptionsMessage={() => "Sin resultados"}
                                        isClearable
                                        isDisabled={opcion === 2}
                                        options={ProveedorSelect}
                                        value={proveedor}
                                        onChange={onChangeProveedor}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!WarningProveedor && <><i className="fas fa-exclamation-circle"></i> Este campo es requerido</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={8} md={8} sm={8}>
                                <FormGroup>
                                    <p className="mb-1">Observacion</p>
                                    <textarea
                                        id="observacion"
                                        name="observacion"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.observacion : ''}
                                        {...register('observacion')}
                                    />
                                </FormGroup>
                            </Col>
                            <Col lg={4} md={4} sm={4}>
                                {
                                    opcion === 3 &&
                                    <Button color="info" type="submit" className="btn btn-block my-lg-4 my-md-4 my-sm-4">Actualizar</Button>
                                }
                                {
                                    opcion === 1 && <>
                                        {
                                            !information && <Button color="primary" type="submit" className="btn btn-block my-lg-4 my-md-4 my-sm-4">Guardar</Button>
                                        }
                                    </>
                                }
                            </Col>
                        </Row>
                    </Form>
                    {information && <>
                        <Form onSubmit={handleSubmit(AddProducto)}>
                            <Row>
                                <Col lg={12} md={12} sm={12} xs={12} className="mt-2">
                                    <FormGroup>
                                        <p className="h4 text-uppercase text-muted ">Detalle de factura</p>
                                        <hr className='invoice-spacing mt-1' />
                                    </FormGroup>
                                </Col>
                                {opcion === 1 && <>

                                    <Col lg={8} md={8} sm={8}>
                                        <FormGroup>
                                            <p className="mb-1">Producto*</p>
                                            <Select
                                                name="Producto"
                                                id="Producto"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="Elija un producto"
                                                noOptionsMessage={() => "Sin resultados"}
                                                isClearable
                                                isDisabled={opcion === 2}
                                                options={ProductoSelect}
                                                value={producto}
                                                onChange={onChangeProducto}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!WarningProducto && <><i className="fas fa-exclamation-circle"></i> Este campo es requerido</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={1} md={1} sm={1}></Col>
                                    <Col lg={3} md={3} sm={3}>
                                        <FormGroup>
                                            <p className="mb-1">Total</p>
                                            <input
                                                id="totalDetalle"
                                                name="totalDetalle"
                                                autoComplete="off"
                                                disabled
                                                className="form-control"
                                                defaultValue={information ? information.totalDetalle : ''}
                                                {...register('totalDetalle', { required: 'Este campo es requerido.', pattern: { value: /^[0-9]*(\.[0-9]{0,4})?$/, message: "Sólo se admiten valores numericos" }, min: { value: 0, message: 'No se admiten valores menor a 0.' } })}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={4} sm={4}>
                                        <FormGroup>
                                            <p className="mb-1">Precio*</p>
                                            <input
                                                id="precioDetalle"
                                                name="precioDetalle"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                className="form-control"
                                                defaultValue={information ? information.precioDetalle : ''}
                                                {...register('precioDetalle', { required: 'Este campo es requerido.', pattern: { value: /^[0-9]*(\.[0-9]{0,4})?$/, message: "Sólo se admiten valores numericos con 4 decimales" }, min: { value: 0, message: 'No se admiten valores menor a 0.' } })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.precioDetalle && <><i className="fas fa-exclamation-circle"></i> {errors.precioDetalle.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={4} sm={4}>
                                        <FormGroup>
                                            <p className="mb-1">Cantidad*</p>
                                            <input
                                                id="cantidadDetalle"
                                                name="cantidadDetalle"
                                                autoComplete="off"
                                                disabled={opcion === 2}
                                                className="form-control"
                                                defaultValue={information ? information.cantidadDetalle : ''}
                                                {...register('cantidadDetalle', { required: 'Este campo es requerido.', pattern: { value: /^[0-9]*(\[0-9])?$/, message: "Sólo se admiten valores numericos" }, min: { value: 0, message: 'No se admiten valores menor a 0.' } })}
                                            />
                                            <span className="text-danger text-small d-block mb-2">
                                                {!!errors.cantidadDetalle && <><i className="fas fa-exclamation-circle"></i> {errors.cantidadDetalle.message}</>}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} className="" >


                                        <FormGroup className="text-left my-2 ">
                                            <Button color="success" type="submit" className="btn btn-block my-lg-4 my-md-4 my-sm-4">Agregar</Button>

                                            {/* <div className="btn btn-info mt-3" type="submit">Agregar</div> */}
                                        </FormGroup>

                                    </Col>
                                </>}
                            </Row>
                        </Form>
                        <Row>
                            <Col>
                                <TablaDetalle detalleFactura={listDetalleFactura} opcion={opcion} />
                            </Col>
                        </Row>
                    </>
                    }
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
                </div>
            </Modal>
        </>
    );
}

export default IngresosModal;
