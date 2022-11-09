import { useState, useEffect } from 'react'
import { Card, Pagination, CardFooter, PaginationItem, PaginationLink, CardHeader, DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Container, CardBody, CardTitle, Row, Col } from "reactstrap";

import { OptionsToast } from 'variables';
import { toast } from 'react-toastify'
import Header from "components/Headers/Header.js";
import RolesUsuarioModal from "views/Modals/admin/RolesUsuarioModal";

import { GetRoute, PostRoute } from '../../services/Private'
import ReactPaginate from 'react-paginate'

const Tables = () => {

  const UsuariosController = "Usuarios"
  const rolesController = "Roles"
  const [listUsers, setListUsers] = useState([]);
  const [listRoles, setListRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [opcion, setOpcion] = useState(0);
  const [contentInfor, setContentInfor] = useState(null);
  const [valueRolesDefault, setValueRolesDefault] = useState([]);
  const [valueRoles, setValueRoles] = useState([]);


  const [offset, setOffset] = useState(0)
  const [perPage] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [filterData, setFilterData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const ListUsuarios = async () => {
    const response = await GetRoute(`${UsuariosController}/getList`)
    setListUsers((response.length) ? response : [])
  },
    ListRoles = async () => {
      const response = await GetRoute(`${rolesController}/getSelectList`)
      setListRoles((response.length) ? response : [])
    },
    RequestResetPass = async (id) => {
      const response = await PostRoute(`${UsuariosController}/update/resetPassword`, { id })
      const msg = (response[0] ? response[0].id : null)
      return msg
    },
    RequestUpdateState = async (data) => {
      const json = { id: data.id, estado: (data.estado === 0 ? 1 : 0) }
      const response = await PostRoute(`${UsuariosController}/update/state`, json)
      ListUsuarios()
      const msg = (response[0] ? response[0].id : null)
      return msg
    },
    RequestUpdateRoles = async (data) => {
      const json = { idPersona: data.id, roles: data.roles }
      const response = await PostRoute(`${UsuariosController}/update/rol`, json)
      ListUsuarios()
      const msg = (response[0] ? response[0].id : null)
      return msg
    },
    toggleModal = (value, option) => {
      setValueRolesDefault([])
      setValueRoles([])
      if (option === 2) {
        if (value) {
          if (listRoles.length > 0) {
            let selectRoles = []

            const roles = (value.roles)
            let arrRoles = roles.split(",")

            arrRoles.forEach(rol => {

              listRoles.forEach(element => {
                if (element.value === rol) {
                  selectRoles.push(element);
                }
              });
            });

            setValueRolesDefault(selectRoles)

          }
        }
      }
      setModalOpen(!modalOpen);
      setContentInfor(value)
      setOpcion(option)
    }

  const updateState = async (item) => {
    let messageToast = 'Usuario ' + (item.estado === 0 ? 'activado' : 'desactivado') + ' correctamente.';
    const stringMsg = await RequestUpdateState(item);
    if (!stringMsg) {
      toast.warning('Ha fallado el cambio de estado.', OptionsToast)
    } else {
      toast.success(messageToast, OptionsToast)
    }
  }

  const restartPass = async (item) => {
    const stringMsg = await RequestResetPass(item.id);
    if (!stringMsg) {
      toast.warning('Ha fallado el restablecimiento de contraseña.', OptionsToast)
    } else {
      toast.success("Se ha restablecido la contraseña", OptionsToast)
    }
  }

  useEffect(() => {
    ListUsuarios();
    ListRoles();
  }, [])

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
                    {/* {e.username} */}

                  </CardTitle>
                  <span className="h2 font-weight-bold mb-0">
                    {e.username}
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
                      <i className="fa fa-user-tie" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      <DropdownItem
                        href="#"
                        onClick={() => restartPass(e)}
                      >
                        Restablecer Contraseña
                      </DropdownItem>
                      <DropdownItem
                        href="#"
                        onClick={() => updateState(e)}
                      >
                        {e.estado === 0 ? 'Activar' : 'Desactivar'}
                      </DropdownItem>
                      <DropdownItem
                        href="#"
                        onClick={() => toggleModal(e, 2)}
                      >
                        Roles
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  {/* <div className="icon icon-shape bg-primary text-white rounded-circle shadow " style={{ cursor: 'pointer' }} onClick={() => toggleModal(e, 1)}>
                    <i className="fa fa-user-tie"></i>
                  </div> */}
                </Col>
              </Row>
              <p className="mt-3 mb-0 text-muted text-sm">
                <span className="text-nowrap mr-2">
                  {e.nombreApellido}
                </span>{" "}
                {/* <span className="text-nowrap">{e.subContent2}</span> */}
              </p>
            </CardBody>
          </Card>
        </Col>
      )
    })
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

  useEffect(() => {
    const fetchData = async () => {
      if (listUsers.length > 0) {
        setPageCount(Math.ceil(listUsers.length / perPage))
        setFilterData(listUsers.slice(offset, offset + perPage))
      }
    }
    fetchData()
  }, [offset, listUsers])

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
                <h3 className="mb-0">Control de Usuarios</h3>
              </CardHeader>
              <Container fluid>
                <div className="header-body">
                  {/* Card stats */}
                  <Row>
                    {renderContent(filterData)}
                    {/* <Col lg="6" xl="3" className="pb-2">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody style={{ background: '#F4F4F4' }}>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Traffic
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                350,897
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                <i className="fas fa-chart-bar" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-success mr-2">
                              <i className="fa fa-arrow-up" /> 3.48%
                            </span>{" "}
                            <span className="text-nowrap">Since last month</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg="6" xl="3" className="pb-2">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody style={{ background: '#F4F4F4' }}>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                New users
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">2,356</span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                <i className="fas fa-chart-pie" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-danger mr-2">
                              <i className="fas fa-arrow-down" /> 3.48%
                            </span>{" "}
                            <span className="text-nowrap">Since last week</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="6" xl="3" className="pb-2">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody style={{ background: '#F4F4F4' }}>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Sales
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">924</span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                <i className="fas fa-users" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-warning mr-2">
                              <i className="fas fa-arrow-down" /> 1.10%
                            </span>{" "}
                            <span className="text-nowrap">Since yesterday</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="6" xl="3" className="pb-2">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody style={{ background: '#F4F4F4' }}>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Performance
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">49,65%</span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                <i className="fas fa-percent" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-success mr-2">
                              <i className="fas fa-arrow-up" /> 12%
                            </span>{" "}
                            <span className="text-nowrap">Since last month</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col> */}
                  </Row>
                </div>

                <CardFooter className="py-4">
                  {CustomPagination()}
                </CardFooter>
              </Container>
              {/* <CardFooter className="py-4">

              </CardFooter> */}
            </Card>
          </div>
        </Row>


      </Container>
      <RolesUsuarioModal RequestUpdateRoles={RequestUpdateRoles} valueRoles={valueRoles} setValueRoles={setValueRoles} listRoles={listRoles} valueRolesDefault={valueRolesDefault} modalOpen={modalOpen} toggleModal={toggleModal} opcion={opcion} information={contentInfor} />
    </>
  );
};

export default Tables;
