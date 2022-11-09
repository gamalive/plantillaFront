import React, { useEffect, Fragment, useState } from "react";
import {
    Card,
    CardHeader,
    Container,
    Alert,
    Row
} from "reactstrap";
import { useForm } from "react-hook-form"
import { PostRoute } from '../../../services/Private'
import Select from 'react-select'
import { OptionsToast } from 'variables';
import { toast } from 'react-toastify'
import * as Icon from 'react-feather'

import DataTable from 'react-data-table-component'
const TablaDetalle = ({ detalleFactura, opcion }) => {

    const Columns = [
        {
            name: 'No.',
            column: 'no',
            sortable: true,
            center: true,
            selector: row => row.no,
            width: '100px',
            cell: row => row['no']
        },
        {
            name: 'Cantidad',
            column: 'cantidad',
            sortable: true,
            selector: row => row.cantidad,
            center: true,
            width: '150px',
            cell: row => row['cantidad']
        },
        {
            name: 'Precio',
            column: 'precio',
            sortable: true,
            center: true,
            selector: row => row.precio,
            width: '150px',
            cell: row => row['precio']
        },
        {
            name: 'Total',
            column: 'total',
            sortable: true,
            selector: row => row.total,
            center: true,
            width: '150px',
            cell: row => row['total']
        },
        {
            name: 'Producto',
            column: 'producto',
            sortable: true,
            selector: row => row.producto,
            center: true,
            cell: row => row['producto']
        },
        {
            name: 'Acciones',
            column: 'id',
            sortable: false,
            center: true,
            width: '100px',
            cell: row => (
                <Fragment>
                    {
                        row.estado === 1 &&
                        <>
                            <Icon.Eye size={20} className="text-info mr-2 me-3 cursor-pointer" onClick={() => console.log(row, 2)} />
                            <Icon.Edit size={20} className="text-primary mr-2 me-3 cursor-pointer" onClick={() => console.log(row, 3)} />
                        </>
                    }
                    {row.estado === 1 ? <Icon.Trash className="text-danger mr-1 me-3 cursor-pointer" size={20} onClick={() => console.log(row)} /> : <Icon.Check className="text-success mr-1 me-3 cursor-pointer" size={20} onClick={() => console.log(row)} />}
                </Fragment>
            )
        }
    ],
        ColumnsSa = [
            {
                name: 'No.',
                column: 'no',
                sortable: true,
                center: true,
                selector: row => row.no,
                width: '100px',
                cell: row => row['no']
            },
            {
                name: 'Cantidad',
                column: 'cantidad',
                sortable: true,
                selector: row => row.cantidad,
                center: true,
                width: '150px',
                cell: row => row['cantidad']
            },
            {
                name: 'Precio',
                column: 'precio',
                sortable: true,
                center: true,
                selector: row => row.precio,
                width: '150px',
                cell: row => row['precio']
            },
            {
                name: 'Total',
                column: 'total',
                sortable: true,
                selector: row => row.total,
                center: true,
                width: '150px',
                cell: row => row['total']
            },
            {
                name: 'Producto',
                column: 'producto',
                sortable: true,
                selector: row => row.producto,
                center: true,
                cell: row => row['producto']
            }
        ]

    return (
        <div className="shadow">
            <Container fluid>
                <DataTable
                    // dense
                    noHeader
                    highlightOnHover
                    pagination
                    data={detalleFactura}
                    columns={(opcion === 1 ? ColumnsSa : ColumnsSa)}
                    className='table-responsive react-dataTable'
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    paginationComponentOptions={
                        {
                            rowsPerPageText: '',
                            rangeSeparatorText: ''
                        }
                    }
                    noDataComponent='Sin Registros'
                />

            </Container>

        </div>

    );
}

export default TablaDetalle;
