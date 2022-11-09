import { useState, useEffect } from 'react'
import {
    Card,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    CardFooter,
    DropdownToggle,
    Container,
    CardBody,
    Pagination,
    PaginationItem,
    PaginationLink,
    CardTitle,
    Row,
    Col,
} from "reactstrap";
import ReactPaginate from 'react-paginate'

import * as Icon from 'react-feather'
import { GetRoute, PostRoute } from '../../services/Private'
import { OptionsToast } from 'variables';
import { toast } from 'react-toastify'
import Header from "components/Headers/Header.js";
import RolesModal from "views/Modals/admin/RolesModal";

const Tables = () => {
    const nameController = "Roles"
    const [modalOpen, setModalOpen] = useState(false);
    const [opcion, setOpcion] = useState(0);
    const [contentInfor, setContentInfor] = useState(null);
    const [listRoles, setListRoles] = useState([]);

    const [offset, setOffset] = useState(0)
    const [perPage] = useState(10)
    const [pageCount, setPageCount] = useState(0)
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const ListRoles = async () => {
        const response = await GetRoute(`${nameController}/getList`)
        setListRoles((response.length) ? response : [])
    },
        RequestUpdateState = async (data) => {
            const json = { id: data.id, estado: (data.estado === 0 ? 1 : 0) }
            const response = await PostRoute(`${nameController}/update/state`, json)
            ListRoles()
            const msg = (response[0] ? response[0].id : null)
            return msg
        }

    const toggleModal = (value, option) => {
        setModalOpen(!modalOpen);
        setContentInfor(value)
        setOpcion(option)
    }

    const updateState = async (item) => {
        let messageToast = 'Rol ' + (item.estado === 0 ? 'activado' : 'desactivado') + ' correctamente.';
        const stringMsg = await RequestUpdateState(item);
        if (!stringMsg) {
            toast.warning('Ha fallado el cambio de estado.', OptionsToast)
        } else {
            toast.success(messageToast, OptionsToast)
        }
    },
        handlePagination = page => {
            setOffset(page.selected * perPage)
            setCurrentPage(page.selected + 1)
        },
        CustomPagination = () => {
            return (
                <nav aria-label="...">
                    <ReactPaginate
                        previousLabel={<i className="fas fa-angle-left"></i>}
                        nextLabel={<i className="fas fa-angle-right"></i>}
                        pageCount={pageCount || 1}
                        activeClassName='active'
                        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                        onPageChange={page => handlePagination(page)}
                        pageClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        nextClassName={'page-item next'}
                        previousClassName={'page-item prev'}
                        previousLinkClassName={'page-link'}
                        pageLinkClassName={'page-link'}
                        containerClassName={'pagination react-paginate d-flex justify-content-end mb-0 my-2 pr-1'}
                    />
                </nav>
            )
        }
    const renderContent = (rolesList) => {
        const contenido = rolesList.length > 0 ? rolesList : []

        return contenido.map((e, i) => {
            return (
                <Col lg="6" xl="3" className="pb-2" key={i}>
                    <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody style={{ background: '#F4F4F4' }}>
                            <Row>
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        {e.codigo}
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                        {e.nombre}
                                    </span>
                                </div>
                                <Col className="col-auto">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            className={`icon icon-shape bg-${e.estado === 0 ? "warning" : "primary"} text-white rounded-circle shadow`}
                                            href="#"
                                            role="button"
                                            size="sm"
                                            color=""
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <i className="fa fa-cogs" />
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                            <DropdownItem
                                                href="#"
                                                onClick={() => toggleModal(e, 2)}
                                            >
                                                Visualizar
                                            </DropdownItem>
                                            <DropdownItem
                                                href="#"
                                                onClick={() => toggleModal(e, 3)}
                                            >
                                                Actualizar
                                            </DropdownItem>
                                            <DropdownItem
                                                href="#"
                                                onClick={() => updateState(e)}
                                            >
                                                {e.estado === 1 ? 'Desactivar' : 'Activar'}
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            )
        })
    }
    useEffect(() => {
        ListRoles()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (listRoles.length > 0) {
                setPageCount(Math.ceil(listRoles.length / perPage))
                setFilterData(listRoles.slice(offset, offset + perPage))
            }
        }
        fetchData()
    }, [offset, listRoles])
    
    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>

                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Administración de Roles<Icon.PlusCircle onClick={() => toggleModal(null, 1)} className="ml-1 cursor-pointer text-green" size={25} style={{ cursor: 'pointer' }} /></h3>

                            </CardHeader>
                            <Container fluid>
                                <div className="header-body">
                                    {/* Card stats */}
                                    <Row>
                                        {renderContent(filterData)}

                                    </Row>
                                </div>
                                <CardFooter className="py-4">
                                    {CustomPagination()}
                                </CardFooter>
                            </Container>

                        </Card>
                    </div>
                </Row>

            </Container>
            <RolesModal modalOpen={modalOpen} ListRoles={ListRoles} toggleModal={toggleModal} opcion={opcion} information={contentInfor} />
        </>
    );
};

export default Tables;
