"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import {
  Box,
  Typography,
  Modal,
  Stack,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = () => {
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    setFilteredInventory(inventory);
  }, [inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      flexDirection="column"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      style={{
        background:
          "linear-gradient(0deg, rgba(65,123,69,1) 0%, rgba(59,103,60,1) 100%)",
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%,-50%)" }}
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
        <TextField
          variant="outlined"
          placeholder="Search items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ backgroundColor: "white" }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
      </Box>
      <Box
        border="1px solid #333"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          width="800px"
          height="100px"
          bgcolor="#333"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#FFF">
            Inventory Items
          </Typography>
        </Box>
        <List style={{ width: "800px", maxHeight: "500px", overflow: "auto" }}>
          {filteredInventory.map(({ name, quantity }) => (
            <ListItem
              key={name}
              style={{
                minHeight: "150px",
                backgroundColor: "#333",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="h3"
                    color="#FFF"
                    style={{ marginLeft: "20px" }}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                }
                style={{ flex: "1" }}
              />
              <Typography
                variant="h3"
                color="#FFF"
                textAlign="center"
                style={{ flex: "4", textAlign: "center" }}
              >
                {quantity}
              </Typography>
              <ListItemSecondaryAction style={{ marginRight: "20px" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => addItem(name)}
                  style={{ marginRight: "10px" }}
                >
                  +1
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                >
                  -1
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
