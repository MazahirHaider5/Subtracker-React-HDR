import React from 'react';
import '../assets/style/globals.css';
import {
  Button,
  Table,
} from 'reactstrap';
import renewal01 from '../assets/images/renewal01.svg'
import dots from '../assets/images/dots.svg'
import breadcrumbHome from '../assets/images/breadcrumbHome.svg'
import breadcrumbArrowRight from '../assets/images/breadcrumbArrowRight.svg'

const CategoryName = () => {
  return (
    <div className='container'>
    <div className='d-flex justify-content-start gap-2'>
    <img src={breadcrumbHome} width={20} height={20} alt='home' className='cursor-pointer' />
    <img src={breadcrumbArrowRight} width={20} height={20} alt='rightArrow' />
    <p className='fs-14   fw-500 text-muted cursor-pointer'>Subscriptions</p>
    <img src={breadcrumbArrowRight} width={20} height={20} alt='rightArrow' />
    <p className='fs-14   fw-500 dark-purple cursor-pointer'>Category</p>
    </div>
    
      <div className='d-flex justify-content-end gap-2'>
        <Button type='button' className=' fw-500 fs-15  btn-fill-color border-1 border-white py-2'  ><span className='fw-600 fs-15'>+</span> Add Subscription</Button>
      </div>
      <div className='mt-3 border rounded'>
        <Table responsive hover>
          <thead >
            <tr>
              <th className="table-head-bg text-nowrap">
                Subscription
              </th>
              <th className="table-head-bg text-nowrap">
                START DATE
              </th>
              <th className="table-head-bg text-nowrap">
                RENEWAL DATE
              </th>
              <th className="table-head-bg text-nowrap">
                Price
              </th>
              <th className="table-head-bg text-nowrap">
                OPTIONS
              </th>

            </tr>
          </thead>
          <tbody>
            <tr className='text-nowrap'>
              <th scope="row" className='py-3 '>
                <img src={renewal01} width={20} height={20} alt='icon' /> <span className='fs-16 fw-500'>SignNTrack</span>
              </th>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                $5.56
              </td>
              <td >
                <img src={dots} width={20} height={20} alt='icon' className='ms-4 cursor-pointer' />
              </td>

            </tr>
            <tr className='text-nowrap'>
              <th scope="row" className='py-3 '>
                <img src={renewal01} width={20} height={20} alt='icon' /> <span className='fs-16 fw-500'>SignNTrack</span>
              </th>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                $5.56
              </td>
              <td >
                <img src={dots} width={20} height={20} alt='icon' className='ms-4 cursor-pointer' />
              </td>

            </tr>
            <tr className='text-nowrap'>
              <th scope="row" className='py-3 '>
                <img src={renewal01} width={20} height={20} alt='icon' /> <span className='fs-16 fw-500'>SignNTrack</span>
              </th>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                $5.56
              </td>
              <td >
                <img src={dots} width={20} height={20} alt='icon' className='ms-4 cursor-pointer' />
              </td>

            </tr>
            <tr className='text-nowrap'>
              <th scope="row" className='py-3 '>
                <img src={renewal01} width={20} height={20} alt='icon' /> <span className='fs-16 fw-500'>SignNTrack</span>
              </th>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                $5.56
              </td>
              <td >
                <img src={dots} width={20} height={20} alt='icon' className='ms-4 cursor-pointer' />
              </td>

            </tr>
            <tr className='text-nowrap'>
              <th scope="row" className='py-3 '>
                <img src={renewal01} width={20} height={20} alt='icon' /> <span className='fs-16 fw-500'>SignNTrack</span>
              </th>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                $5.56
              </td>
              <td >
                <img src={dots} width={20} height={20} alt='icon' className='ms-4 cursor-pointer' />
              </td>

            </tr>
            <tr className='text-nowrap'>
              <th scope="row" className='py-3 '>
                <img src={renewal01} width={20} height={20} alt='icon' /> <span className='fs-16 fw-500'>SignNTrack</span>
              </th>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                12/11/2024 07:23
              </td>
              <td className='text-muted fs-14 fw-500 py-3 '>
                $5.56
              </td>
              <td >
                <img src={dots} width={20} height={20} alt='icon' className='ms-4 cursor-pointer' />
              </td>

            </tr>

          </tbody>
        </Table>

      </div>



    </div>
  );
};

export default CategoryName;
