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

const ClientesModal = ({ modalOpen, nameController, toggleModal, information, setInformation, opcion, ListClientes }) => {


    const { register, handleSubmit, watch, formState: { errors }, clearErrors, reset, setValue } = useForm(),

        StoreUpdate = async (data, id) => {
            let response = []
            response = await PostRoute(`${nameController}/${!id ? 'create' : 'update'}`, data)

            if (response[0]) {

                setInformation("")
                toast.success(`Se ha ${!id ? 'creado' : 'modificado'} el registro con éxito`, OptionsToast)
                const json = { ...response[0], ...data };
                setInformation(json)
                ListClientes()
                toggleModal(null, 0)
                reset()

            } else {
                toast.warning("No se logró realizar el registro.", OptionsToast)
            }
            // reset()
        },
        onSubmit = (data) => {
            const json = { id: (information ? information.id : null) }
            const jsonRequest = { ...json, ...data }
            StoreUpdate(jsonRequest, information ? information.id : null)
            clearErrors()

        },
        setData = async () => {
            await setValue('nombres', information.nombres)
            await setValue('apellidos', information.apellidos)
            await setValue('direccion', information.direccion)
            await setValue('nit', information.nit)
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
                toggle={function noRefCheck(e) { toggleModal(null, 0); clearErrors(); }}
                className="modal-dialog-centered"
                size="md"
            >
                <Form onSubmit={(opcion !== 2) ? handleSubmit(onSubmit) : () => toggleModal(null, 0)}>

                    <div className="modal-header pb-0">
                        <h3 className="modal-title" id="modalOpenLabel">
                            {opcion === 1 && 'Crear '}Cliente
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={function noRefCheck(e) { toggleModal(null, 0); reset() }}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Row className="mt-2">
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Nombres*</p>
                                    <input
                                        id="nombres"
                                        name="nombres"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.nombres : ''}
                                        {...register('nombres', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.nombres && <><i className="fas fa-exclamation-circle"></i> {errors.nombres.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Apellidos*</p>
                                    <input
                                        id="apellidos"
                                        name="apellidos"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        defaultValue={information ? information.apellidos : ''}
                                        {...register('apellidos', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.apellidos && <><i className="fas fa-exclamation-circle"></i> {errors.apellidos.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">NIT*</p>
                                    <input
                                        id="nit"
                                        name="nit"
                                        autoComplete="off"
                                        defaultValue={information ? information.nit : ''}
                                        disabled={opcion === 2}
                                        className="form-control"
                                        {...register('nit', { required: 'Este campo es requerido.', pattern: { value: /^[0-9]*(\.[0-9])?$/, message: "Sólo se admiten valores numericos" }, min: { value: 0, message: 'No se permiten valores menor a 0' } })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.nit && <><i className="fas fa-exclamation-circle"></i> {errors.nit.message}</>}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col lg={6} md={6} sm={12}>
                                <FormGroup>
                                    <p className="mb-1">Dirección</p>
                                    <input
                                        id="direccion"
                                        name="direccion"
                                        disabled={opcion === 2}
                                        defaultValue={information ? information.direccion : ''}
                                        className="form-control"
                                        aria-label="Dirección..."
                                        {...register('direccion')}
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

export default ClientesModal;
