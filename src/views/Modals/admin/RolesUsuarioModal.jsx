import React from "react";

import {
    Button,
    FormGroup,
    Modal,
    Row,
    Col
} from "reactstrap";

import Select from 'react-select'
import { useState } from "react";
import { toast } from 'react-toastify'
import { OptionsToast } from 'variables';

const InfoUserModal = ({ RequestUpdateRoles, modalOpen, valueRoles, setValueRoles, toggleModal, information, listRoles, valueRolesDefault, opcion }) => {

    const onChange = (data) => {
        setValueRoles(data)
    },
        onClick = async (data) => {
            let rolesSave = ""
            if (data.length > 0) {
                data.forEach((element, i) => {
                    if (i !== (data.length - 1)) {
                        rolesSave += (element.value) + ",";
                    } else {
                        rolesSave += (element.value);
                    }
                });
                const jsonRequest = { id: information.id, roles: rolesSave }
                const stringMsg = await RequestUpdateRoles(jsonRequest);
                if (!stringMsg) {
                    toast.warning('Ha fallado al asignar roles.', OptionsToast)
                } else {
                    toast.success("Se han asignado los roles correctamente.", OptionsToast)
                }
            } else {
                toast.warning('Debe asignar un rol.', OptionsToast)
            }
        }

    return (
        <>
            <Modal
                isOpen={modalOpen}
                toggle={() => toggleModal(null, 0)}
                className="modal-dialog-centered"
                size="xs"
            >

                <div className="modal-header">
                    <h5 className="modal-title" id="modalOpenLabel">
                        Roles de {information && information.nombreApellido}
                    </h5>
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
                    <Row>
                        <Col>
                            <FormGroup>
                                <p className="mb-1">Roles</p>
                                <Select
                                    isMulti
                                    name="roles"
                                    id="roles"
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Selecciona roles"
                                    noOptionsMessage={() => "Sin resultados"}
                                    options={listRoles}
                                    isClearable
                                    defaultValue={valueRolesDefault}
                                    onChange={onChange}
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
                        onClick={() => toggleModal(null, 0)}
                    >
                        Salir
                    </Button>
                    <Button color="primary" type="button" onClick={() => onClick(valueRoles)}>
                        Guardar
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default InfoUserModal;
