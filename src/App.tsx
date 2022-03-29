import { Button, Container, Input, Select, Stack } from "@chakra-ui/react";
import { Fragment, useRef, useState } from "react";

function App() {
  const formRef = useRef<any>();
  const [form, setForm] = useState(null);

  const handlerChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;

    setForm((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    //
    console.log({ form });

    setForm(null);
    formRef.current?.reset();
  };

  return (
    <Fragment>
      <Container>
        <form ref={formRef} onSubmit={handleSubmit}>
          <Stack spacing={5} margin={10}>
            <Select placeholder="Select option">
              <option value="cat1">Cat 1</option>
              <option value="cat2">Cat 2</option>
              <option value="cat3">Cat 3</option>
            </Select>
            <Input
              name="name"
              variant="filled"
              placeholder="Name"
              onChange={handlerChange}
            />
            <Input
              name="price"
              variant="filled"
              placeholder="Price"
              onChange={handlerChange}
              type="number"
            />
            <Input
              name="cost"
              variant="filled"
              placeholder="Cost"
              onChange={handlerChange}
              type="number"
            />
            <Input
              name="amount"
              variant="filled"
              placeholder="Amount"
              onChange={handlerChange}
              type="number"
            />
            <Button type="submit" colorScheme="orange">
              Save
            </Button>
          </Stack>
        </form>
      </Container>
    </Fragment>
  );
}

export default App;
