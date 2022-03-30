import {
  Button,
  Container,
  Input,
  Select,
  Spinner,
  Stack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { ref, push, onValue, set } from "firebase/database";

import { database } from "./firebase";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

function App() {
  const formRef = useRef<any>();

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<any>(null);

  const [selectedIdForDelete, setSelectedIdForDelete] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();

  const handlerChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    console.log({ name, value });
    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    try {
      setIsLoading(true);
      event.preventDefault();

      if (form.id) {
        set(ref(database, "menus/" + form.id), form);
      } else {
        push(ref(database, "menus/"), form);
      }

      toast({
        title: "Success",
        description: `Menu ${form.id ? "updated" : "created"} successfully`,
        status: "success",
      });
      setForm(null);
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);

    onValue(ref(database, "menus"), (snapshot) => {
      const newMenus: SetStateAction<any[]> = [];
      snapshot.forEach((childSnapshot) => {
        console.log({ ...childSnapshot.val(), id: childSnapshot.key });
        newMenus.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });
      setMenus(newMenus);
    });
    setIsLoading(false);
  }, []);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await set(ref(database, "menus/" + selectedIdForDelete), null);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  const handleEdit = async (id: any) => {
    try {
      setIsLoading(true);

      const starCountRef = ref(database, "menus/" + id);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();

        setForm({ ...data, id: snapshot.key });
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <Center flex={1}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Fragment>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Confirm Delete</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Are you sure you want to delete?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Container>
        <form ref={formRef} onSubmit={handleSubmit}>
          <Stack spacing={5} margin={10}>
            <Select
              name="category"
              placeholder="Select option"
              onChange={handlerChange}
              value={form?.category}
            >
              <option value="cat1">Cat 1</option>
              <option value="cat2">Cat 2</option>
              <option value="cat3">Cat 3</option>
            </Select>
            <Input
              name="name"
              variant="filled"
              placeholder="Name"
              onChange={handlerChange}
              value={form?.name}
            />
            <Input
              name="price"
              variant="filled"
              placeholder="Price"
              onChange={handlerChange}
              type="number"
              value={form?.price}
            />
            <Input
              name="cost"
              variant="filled"
              placeholder="Cost"
              onChange={handlerChange}
              type="number"
              value={form?.cost}
            />
            <Input
              name="amount"
              variant="filled"
              placeholder="Amount"
              onChange={handlerChange}
              type="number"
              value={form?.amount}
            />
            <Button type="submit" colorScheme="orange">
              Save
            </Button>
          </Stack>
        </form>
      </Container>
      <Stack spacing={5} margin={10}>
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Simple CRUD for Menu</TableCaption>
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Name</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>Cost</Th>
                <Th isNumeric>Amount</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {menus.map(({ id, category, name, price, cost, amount }) => (
                <Tr key={id}>
                  <Td>{category}</Td>
                  <Td>{name}</Td>
                  <Td isNumeric>{price}</Td>
                  <Td isNumeric>{cost}</Td>
                  <Td isNumeric>{amount}</Td>
                  <Td>
                    <IconButton
                      mx={2}
                      onClick={() => {
                        onOpen();
                        setSelectedIdForDelete(id);
                      }}
                      aria-label="Delete"
                      icon={<DeleteIcon color={"red"} />}
                    />
                    <IconButton
                      onClick={() => handleEdit(id)}
                      aria-label="Edit"
                      icon={<EditIcon color={"orange"} />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Fragment>
  );
}

export default App;
