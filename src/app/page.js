'use client'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ModalFooter,
} from '@chakra-ui/react';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IoMdAdd, IoMdCreate, IoMdEye, IoMdTrash } from "react-icons/io";


export default function Home() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);

  const [newName, setNewName] = useState();
  const [newDayRate, setNewDayRate] = useState();
  const [newMonthRate, setNewMonthRate] = useState();
  const [newImage, setNewImage] = useState();

  const [editData, setEditData] = useState();

  const getCar = async () => {
    try {
      let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}car`);
      if (res.status == 200) {
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addCar = async () => {
    try {
      let res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}car`, {
        car_name: newName,
        day_rate: newDayRate,
        month_rate: newMonthRate,
        image: newImage,
      });
      if (res.status == 200) {
        setOpenAdd(false);
        getCar();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const editCar = async (id) => {
    try {
      let res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}car/${id}`, editData);
      if (res.status == 200) {
        setOpenEdit((prev) => prev = false);
        getCar();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteCar = async (id) => {
    try {
      let res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}car/${id}`);
      if (res.status == 200) {
        setOpenDelete((prev) => prev = false);
        getCar();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCar();
  }, []);

  return (
    <div className="mx-auto min-h-[90vh] p-20 bg-white text-gray-700">
      <div className='flex justify-center items-center text-2xl mb-5 tracking-wider font-semibold'>
        CAR LIST
      </div>
      <div className='flex justify-end items-center mb-2'>
        <Button colorScheme='blue' rightIcon={<IoMdAdd />} variant='outline' onClick={() => setOpenAdd((prev) => prev = true)}>Add</Button>
      </div>
      <TableContainer className='border border-gray-300 rounded-xl'>
        <Table variant='striped' colorScheme='blue'>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Car Name</Th>
              <Th>Daily Rate (IDR)</Th>
              <Th>Monthly Rate (IDR)</Th>
              <Th>Car Photo</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((val, idx) => (
              <Tr key={idx}>
                <Td>{idx + 1}</Td>
                <Td>{val.car_name}</Td>
                <Td>{val.day_rate}</Td>
                <Td>{val.month_rate}</Td>
                <Td>{val.image && <img src={val.image} alt='' className='rounded-lg w-32' />}</Td>
                <Td>
                  <div className='flex space-x-2 items-center'>
                    <Button colorScheme='yellow' variant='outline' size='sm' onClick={() => {
                      setOpenEdit((prev) => prev = true);
                      setDataEdit(val);
                      setEditData({ car_name: val.car_name, day_rate: val.day_rate, month_rate: val.month_rate, image: val.image });
                    }}><IoMdCreate /></Button>
                    <Button colorScheme='red' variant='outline' size='sm' onClick={() => {
                      setOpenDelete((prev) => prev = true);
                      setDataDelete(val);
                    }}><IoMdTrash /></Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* Modal add here */}
      <Modal isOpen={openAdd} onClose={() => setOpenAdd((prev) => prev = false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add new car
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className='space-y-3'>
            <FormControl isRequired>
              <FormLabel>Car Name</FormLabel>
              <Input type='text' onChange={(e) => setNewName((prev) => prev = e.target.value)} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Daily Rate (IDR)</FormLabel>
              <Input type='number' onChange={(e) => setNewDayRate((prev) => prev = e.target.value)} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Monthly Rate (IDR)</FormLabel>
              <Input type='number' onChange={(e) => setNewMonthRate((prev) => prev = e.target.value)} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Car Image (URL)</FormLabel>
              {newImage &&
                <div className='flex items-center justify-center'>
                  <img src={newImage} alt='' className='max-w-[100%] max-h-[30vh] mb-3 rounded-lg' />
                </div>
              }
              <Input type='text' onChange={(e) => setNewImage((prev) => prev = e.target.value)} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' onClick={() => setOpenAdd((prev) => prev = false)} variant='ghost' mr={3}>Cancel</Button>
            <Button colorScheme='blue' onClick={addCar}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal edit here */}
      <Modal isOpen={openEdit} onClose={() => setOpenEdit((prev) => prev = false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Edit ({dataEdit.car_name})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className='space-y-3'>
            <FormControl isRequired>
              <FormLabel>Car Name</FormLabel>
              <Input type='text' defaultValue={dataEdit.car_name} onChange={(e) => setEditData((prev) => prev = { ...prev, car_name: e.target.value })} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Daily Rate (IDR)</FormLabel>
              <Input type='number' defaultValue={dataEdit.day_rate} onChange={(e) => setEditData((prev) => prev = { ...prev, day_rate: e.target.value })} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Monthly Rate (IDR)</FormLabel>
              <Input type='number' defaultValue={dataEdit.month_rate} onChange={(e) => setEditData((prev) => prev = { ...prev, month_rate: e.target.value })} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Car Image</FormLabel>
              {editData?.image &&
                <div className='flex items-center justify-center'>
                  <img src={editData?.image} alt='' className='max-w-[100%] max-h-[30vh] mb-3 rounded-lg' />
                </div>
              }
              <Input type='text' onChange={(e) => setEditData((prev) => prev = { ...prev, image: e.target.value })} defaultValue={editData?.image} />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' onClick={() => setOpenEdit((prev) => prev = false)} variant='ghost' mr={3}>Cancel</Button>
            <Button colorScheme='blue' onClick={() => editCar(dataEdit.car_id)}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal delete here */}
      <Modal isOpen={openDelete} onClose={() => setOpenDelete((prev) => prev = false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete?</ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' variant='ghost' onClick={() => setOpenDelete((prev) => prev = false)} mr={3}>Cancel</Button>
            <Button colorScheme='red' onClick={() => deleteCar(dataDelete.car_id)}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
