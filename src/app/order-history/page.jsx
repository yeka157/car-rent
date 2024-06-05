"use client";
import React, { useEffect, useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import { IoMdAdd, IoMdCreate, IoMdTrash } from "react-icons/io";
import axios from "axios";

export default function Home() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [carList, setCarList] = useState([]);
  const [data, setData] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);
  const [dataEdit, setDataEdit] = useState([]);

  const [newCarId, setNewCarId] = useState();
  const [newPickupDate, setNewPickupDate] = useState();
  const [newDropoffDate, setNewDropoffDate] = useState();
  const [newPickupLocation, setNewPickupLocation] = useState();
  const [newDropoffLocation, setNewDropoffLocation] = useState();

  const [editData, setEditData] = useState();

  const getCar = async () => {
    try {
      let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}car`);
      if (res.status == 200) {
        setCarList((prev) => (prev = res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOrder = async () => {
    try {
      let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}order`);
      if (res.status == 200) {
        setData((prev) => (prev = res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addOrder = async () => {
    try {
      let res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}order`, {
        car_id: newCarId,
        pickup_date: newPickupDate,
        dropoff_date: newDropoffDate,
        pickup_location: newPickupLocation,
        dropoff_location: newDropoffLocation,
      });
      if (res.status == 200) {
        setOpenAdd(false);
        getOrder();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editOrder = async (id) => {
    try {
      let res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}order/${id}`, editData);
      if (res.status == 200) {
        setOpenEdit((prev) => prev = false);
        getOrder();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      let res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}order/${id}`
      );
      if (res.status == 200) {
        setOpenDelete((prev) => (prev = false));
        getOrder();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCar();
    getOrder();
  }, []);

  return (
    <div className="mx-auto min-h-[90vh] p-20 bg-white text-gray-700">
      <div className="flex justify-center items-center text-2xl mb-5 tracking-wider font-semibold">
        CAR ORDER HISTORY
      </div>
      <div className="flex justify-end items-center mb-2">
        <Button
          colorScheme="blue"
          rightIcon={<IoMdAdd />}
          variant="outline"
          onClick={() => setOpenAdd((prev) => (prev = true))}
        >
          Add
        </Button>
      </div>
      <TableContainer className="border border-gray-300 rounded-xl">
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Car Name</Th>
              <Th>Order Date</Th>
              <Th>Pick Up Date</Th>
              <Th>Drop Off Date</Th>
              <Th>Pick Up Location</Th>
              <Th>Drop Off Location</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((val, idx) => (
              <Tr key={idx}>
                <Td>{idx + 1}</Td>
                <Td>{val.car_name}</Td>
                <Td>
                  {new Date(val.order_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Td>
                <Td>
                  {new Date(val.pickup_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Td>
                <Td>
                  {new Date(val.dropoff_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Td>
                <Td>{val.pickup_location}</Td>
                <Td>{val.dropoff_location}</Td>
                <Td>
                  <div className="flex space-x-2 items-center">
                    <Button
                      colorScheme="yellow"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpenEdit((prev) => (prev = true));
                        setDataEdit(val);
                        setEditData({
                          car_id: val.car_id,
                          pickup_date: val.pickup_date,
                          dropoff_date: val.dropoff_date,
                          pickup_location: val.pickup_location,
                          dropoff_location: val.dropoff_location,
                        });
                      }}
                    >
                      <IoMdCreate />
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpenDelete((prev) => (prev = true));
                        setDataDelete(val);
                      }}
                    >
                      <IoMdTrash />
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal add here */}

      <Modal
        isOpen={openAdd}
        onClose={() => setOpenAdd((prev) => (prev = false))}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new order</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="space-y-3">
            <FormControl isRequired>
              <FormLabel>Car Name</FormLabel>
              <Select
                onChange={(e) => setNewCarId((prev) => (prev = e.target.value))}
              >
                {carList.map((val, idx) => (
                  <option value={val.car_id} key={idx}>
                    {val.car_name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Pick Up Date</FormLabel>
              <Input
                type="date"
                onChange={(e) =>
                  setNewPickupDate((prev) => (prev = e.target.value))
                }
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Drop Off Date</FormLabel>
              <Input
                type="date"
                onChange={(e) =>
                  setNewDropoffDate((prev) => (prev = e.target.value))
                }
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Pick Up Location</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setNewPickupLocation((prev) => (prev = e.target.value))
                }
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Drop Off Location</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setNewDropoffLocation((prev) => (prev = e.target.value))
                }
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => setOpenAdd((prev) => (prev = false))}
              variant="ghost"
              mr={3}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={addOrder}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal edit here */}

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit((prev) => (prev = false))}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit order</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="space-y-3">
            <FormControl isRequired>
              <FormLabel>Car Name</FormLabel>
              <Select
                onChange={(e) =>
                  setEditData(
                    (prev) => (prev = { ...prev, car_id: e.target.value })
                  )
                }
              >
                {carList.map((val, idx) => (
                  <option
                    value={val.car_id}
                    key={idx}
                    selected={val.car_id == dataEdit.car_id}
                  >
                    {val.car_name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Pick Up Date</FormLabel>
              <Input
                type="date"
                onChange={(e) =>
                  setEditData(
                    (prev) => (prev = { ...prev, pickup_date: e.target.value })
                  )
                }
                defaultValue={new Date(dataEdit.pickup_date).toLocaleDateString(
                  "en-CA",
                  { year: "numeric", month: "2-digit", day: "2-digit" }
                )}
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Drop Off Date</FormLabel>
              <Input
                type="date"
                onChange={(e) =>
                  setEditData(
                    (prev) => (prev = { ...prev, dropoff_date: e.target.value })
                  )
                }
                defaultValue={new Date(
                  dataEdit.dropoff_date
                ).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Pick Up Location</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setEditData(
                    (prev) =>
                      (prev = { ...prev, pickup_location: e.target.value })
                  )
                }
                defaultValue={dataEdit.pickup_location}
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Drop Off Location</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setEditData(
                    (prev) =>
                      (prev = { ...prev, dropoff_location: e.target.value })
                  )
                }
                defaultValue={dataEdit.dropoff_location}
              />
              <FormErrorMessage></FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => setOpenEdit((prev) => (prev = false))}
              variant="ghost"
              mr={3}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={() => editOrder(dataEdit.order_id)}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal delete here */}

      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete((prev) => (prev = false))}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="ghost"
              onClick={() => setOpenDelete((prev) => (prev = false))}
              mr={3}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => deleteOrder(dataDelete.order_id)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
