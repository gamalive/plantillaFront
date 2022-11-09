import React, { useEffect } from "react";

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    FormFeedback,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Modal,
    Row,
    Col
} from "reactstrap";
import { useForm } from "react-hook-form"
import { PostRoute } from '../../../services/Private'

const InfoUserModal = ({ modalOpen, toggleModal, information, opcion, ListRoles }) => {

    const nameController = "Roles"
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm(),

        StoreUpdate = async (data, id) => {
            let response = []
            response = await PostRoute(`${nameController}/${!id ? 'create' : 'update'}`, data)
            // toast.success(response.message, OptionsToast)
            ListRoles()
            toggleModal(null, 0)
            reset()
        },

        onSubmit = (data) => {
            const id = (information ? information.id : null),

                json = {
                    id,
                    nombre: data.nombre,
                    codigo: data.codigo
                }

            StoreUpdate(json, id)
            clearErrors()
        },
        setData = async () => {
            await setValue('codigo', information.codigo)
            await setValue('nombre', information.nombre)
        }

    useEffect(
        () => {
            async function fetchMyAPI() {
                if (await opcion > 1 && information) { await setData() } else {

                    clearErrors()
                    reset()
                }
            }
            fetchMyAPI()

        }, [opcion, information]
    )
    return (
        <>
            <Modal
                isOpen={modalOpen}
                toggle={function noRefCheck(e) { toggleModal(null, 0); clearErrors(); reset(); }}
                className="modal-dialog-centered"
                size="md"
            >
                <Form onSubmit={(opcion !== 2) ? handleSubmit(onSubmit) : () => toggleModal(null, 0)}>

                    <div className="modal-header">
                        <h3 className="modal-title" id="modalOpenLabel">
                            {opcion === 1 && 'Crear '}Rol
                        </h3>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => toggleModal()}
                        >
                            <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {
                            opcion > 1 &&
                            <Row>
                                <Col lg={4} md={4}>
                                    <FormGroup>
                                        <p className="mb-1">Código</p>
                                        <input
                                            id="codigo"
                                            name="codigo"
                                            className="form-control"
                                            disabled
                                            autoComplete="off"
                                            {...register('codigo')}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <FormGroup>
                                    <p className="mb-1">Nombre</p>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        autoComplete="off"
                                        disabled={opcion === 2}
                                        className="form-control"
                                        {...register('nombre', { required: 'Este campo es requerido.' })}
                                    />
                                    <span className="text-danger text-small d-block mb-2">
                                        {!!errors.nombre && <><i className="fas fa-exclamation-circle"></i> {errors.nombre.message}</>}
                                    </span>
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
                            opcion === 3 && <Button color="primary" type="submit">Actualizar</Button>
                        }
                        {
                            opcion === 1 && <Button color="primary" type="submit">Guardar</Button>
                        }

                    </div>
                </Form>
            </Modal>
        </>
    );
}

export default InfoUserModal;
