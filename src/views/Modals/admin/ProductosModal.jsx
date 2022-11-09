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

const ProductosModal = ({ modalOpen, nameController, CategoriasSelect, toggleModal, information, setInformation, opcion, ListProductos }) => {


    const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset, setValue } = useForm(),
        [WarningCategorias, setWarningCategorias] = useState(false),
        [categorias, setCategorias] = useState(null),

        StoreUpdate = async (data, id) => {
            let response = []
            response = await PostRoute(`${nameController}/${!id ? 'create' : 'update'}`, data)

            if (response[0]) {

                setInformation("")
                toast.success(`Se ha ${!id ? 'creado' : 'modificado'} el registro con éxito`, OptionsToast)
                const json = { ...response[0], ...data };
                setInformation(json)
                ListProductos()
                toggleModal(null, 0)
                reset()

            } else {
                toast.warning("No se logró realizar el registro.", OptionsToast)
            }
            // reset()
        },
        onSubmit = (data) => {
            if (categorias) {

                const json = { id: (information ? information.id : null), CodigoCategoria: categorias.value }
                const jsonRequest = { ...json, ...data }
                StoreUpdate(jsonRequest, information ? information.id : null)
                clearErrors()
            } else {
                toast.warning("Categoria no asignada.", OptionsToast)
            }
        },
        onChangeCategorias = (data) => {
            if (data) {
                setWarningCategorias(false)
            } else {
                setWarningCategorias(true)
            }
            setCategorias(data)
        },
        setData = async () => {
            await setValue('nombre', information.nombre)
            await setValue('codigo', information.codigo)
            await setValue('marca', information.marca)
            await setValue('presentacion', information.presentacion)
            await setValue('unidad', information.unidad)
            await setCategorias({ value: information.idCategorias, label: information.categoria })
        }

    useEffect(
        () => {
            async function fetchMyAPI() {
                if (await opcion > 1 && information) {
                    await setData()
                } else {
                    reset()
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
                toggle={function noRefCheck(e) { toggleModal(null, 0); setCategorias(null); clearErrors(); }}
                className="modal-dialog-centered"
                size="md"
            >
                <Form onSubmit={(opcion !== 2) ? handleSubmit(onSubmit) : () => toggleModal(null, 0)}>

                    <div className="modal-header pb-0">
                        <h3 className="modal-title" id="modalOpenLabel">
                            {opcion === 1 && 'Crear '}Productos
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={function noRefCheck(e) { toggleModal(null, 0); setCategorias(null); reset() }}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Row className="mt-2">
                            {
                                information &&
                                <Col lg={12} md={12} sm={12}>
                                    <FormGroup>
                                        <p className="mb-1">Código</p>
                                        <input
                                            id="codigo"
                                            name="codigo"
                                            autoComplete="off"
                                            disabled
                                            className="form-control"
                                            defaultValue={information ? information.codigo : ''}
                                            {...register('codigo')}
                                        />
                                    </FormGroup>
                                </Col>
                            }
                            <Col lg={12} md={12} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Nombre*</p>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.nombre : ''}
                                        {...register('nombre', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.nombre && <><i className="fas fa-exclamation-circle"></i> {errors.nombre.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Marca*</p>
                                    <input
                                        id="marca"
                                        name="marca"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.marca : ''}
                                        {...register('marca', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.marca && <><i className="fas fa-exclamation-circle"></i> {errors.marca.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Presentación*</p>
                                    <input
                                        id="presentacion"
                                        name="presentacion"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.presentacion : ''}
                                        {...register('presentacion', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.presentacion && <><i className="fas fa-exclamation-circle"></i> {errors.presentacion.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Unidad*</p>
                                    <input
                                        id="unidad"
                                        name="unidad"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.unidad : ''}
                                        {...register('unidad', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.unidad && <><i className="fas fa-exclamation-circle"></i> {errors.unidad.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Categorias*</p>
                                    <Select
                                        name="Categorias"
                                        id="Categorias"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="Elija una categoría"
                                        noOptionsMessage={() => "Sin resultados"}
                                        isClearable
                                        isDisabled={opcion === 2}
                                        options={CategoriasSelect}
                                        value={categorias}
                                        onChange={onChangeCategorias}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!WarningCategorias && <><i className="fas fa-exclamation-circle"></i> Este campo es requerido</>}
                                    </span>
                                </FormGroup>
                            </Col>
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
                        </Row>

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
                            opcion === 3 &&
                            <Button color="info" type="submit">Actualizar</Button>
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

export default ProductosModal;
