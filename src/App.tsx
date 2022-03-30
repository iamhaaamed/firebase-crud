import {
  Button,
  Container,
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
import { CustomInput } from "./components/CustomInput";
import { Formiz, useForm } from "@formiz/core";
import { CustomSelect } from "./components/CustomSelect";

function App() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedIdForDelete, setSelectedIdForDelete] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();

  const myForm = useForm();

  const handleSubmit = (values: any) => {
    try {
      setIsLoading(true);

      if (values?.id) {
        set(ref(database, "menus/" + values.id), values);
      } else {
        push(ref(database, "menus/"), values);
      }

      toast({
        title: "Success",
        description: `Menu ${values?.id ? "updated" : "created"} successfully`,
        status: "success",
      });
      myForm.reset({ only: ["resetKey", "values"] });
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
        newMenus.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });
      setMenus(newMenus);
    });
    setIsLoading(false);
  }, []);

  const handleDelete = async () => {
    try {
      await set(ref(database, "menus/" + selectedIdForDelete), null);
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

        myForm.setFieldsValues(data);
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
        <Formiz
          connect={myForm}
          onValidSubmit={handleSubmit} // Handle submit only if the form is valid
        >
          <form noValidate onSubmit={myForm.submit}>
            <Stack margin={10}>
              <CustomSelect
                required="Category is required"
                id="category"
                name="category"
                placeholder="Select option"
                label="Category"
                options={[
                  { label: "Cat 1", value: "cat1" },
                  { label: "Cat 2", value: "cat2" },
                  { label: "Cat 3", value: "cat3" },
                ]}
              />

              <CustomInput
                required="Name is required"
                id="name"
                name="name"
                variant="filled"
                label="Name"
              />
              <CustomInput
                required="Price is required"
                id="price"
                name="price"
                variant="filled"
                label="Price"
                type="number"
              />
              <CustomInput
                required="Cost is required"
                id="cost"
                name="cost"
                variant="filled"
                label="Cost"
                type="number"
              />
              <CustomInput
                required="Amount is required"
                id="amount"
                name="amount"
                variant="filled"
                label="Amount"
                type="number"
              />
              <Button
                disabled={!myForm.isValid}
                type="submit"
                colorScheme="orange"
              >
                Save
              </Button>
            </Stack>
          </form>
        </Formiz>
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
