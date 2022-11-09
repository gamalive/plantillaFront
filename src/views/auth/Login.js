import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import { useForm } from "react-hook-form"
import { userService } from '../../services/UserServices'

const Login = () => {

  const nameController = "Roles"
  const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm(),
    [viewPass, setViewPas] = useState(false),
    [messageError, setMessageError] = useState(false),
    [loading, setLoading] = useState(false),

    onSubmit = async (data) => {
      setMessageError(false)
      setLoading(true)

      userService.login(data).then(() => {
        window.location.href = "/"
      },
        error => {
          setLoading(false)
          if (String(error) === 'TypeError: Failed to fetch') {
            setMessageError('El navegador no pudo establecer una conexión al servidor')
          } else {
            setMessageError(error)
          }
        }
      )
    }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form onSubmit={handleSubmit(onSubmit)}>
              {
                messageError && <div className="text-center pb-1 alert alert-danger" role="alert" >
                  <span className="text-white-55 text-small d-block mb-2">
                    {messageError && <><i className="fas fa-exclamation-circle"></i> {messageError}</>}
                  </span>
                </div>
              }

              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-circle-08" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Usuario"
                    {...register('username', { required: 'Este campo es requerido.' })}
                  />
                </InputGroup>
                <span className="text-danger text-small d-block mb-2">
                  {!!errors.username && <><i className="fas fa-exclamation-circle"></i> {errors.username.message}</>}
                </span>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    id="password"
                    name="password"
                    className="form-control"
                    autoComplete="new-password"
                    placeholder="Password"
                    type={`${viewPass ? 'text' : 'password'}`}
                    {...register('password', { required: 'Este campo es requerido.' })}
                  />
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className={`far fa-${viewPass ? 'eye-slash' : 'eye'} text-black-50`} style={{ cursor: 'pointer' }} onClick={() => setViewPas(!viewPass)} />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <span className="text-danger text-small d-block mb-2">
                  {!!errors.password && <><i className="fas fa-exclamation-circle"></i> {errors.password.message}</>}
                </span>
              </FormGroup>

              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Iniciar Sesión
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Olvidó su contraseña?</small>
            </a>
          </Col>
          {/* <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col> */}
        </Row>
      </Col>
    </>
  );
};

export default Login;
