import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import axiosInstance from '../../components/axiosInstance';
import ProductForm from './ProductForm';

const ProductList = ({ refreshDashboard }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axiosInstance.delete(`/api/admin/products/${productId}`);
      refreshDashboard();
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFormSubmit = async (productData) => {
    try {
      const user = JSON.parse(localStorage.getItem('admin') || localStorage.getItem('user'));
      if (!user?.token || !user?._id) {
        throw new Error('Invalid session. Please login again.');
      }

      // Validate image URL
      const imageUrl = (productData.imageUrl || '').trim();
      if (!imageUrl || !/^https?:\/\/.+\..+$/.test(imageUrl)) {
        throw new Error('Please enter a valid image URL starting with http:// or https://');
      }

      if (selectedProduct) {
        await axiosInstance.put(
          `/api/admin/products/${selectedProduct._id}`,
          productData
        );
      } else {
        const productPayload = {
          name: (productData.name || '').trim(),
          description: (productData.description || '').trim(),
          price: Number(productData.price),
          stock: Number(productData.stock),
          category: productData.category,
          imageUrl: imageUrl,
          createdBy: user._id
        };

        await axiosInstance.post('/api/admin/products', productPayload);
      }
      
      refreshDashboard();
      const response = await axiosInstance.get('/api/admin/products');
      setProducts(response.data);
      setOpenDialog(false);
      setSelectedProduct(null);
    } catch (error) {
      let errorMessage = 'Failed to save product: ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += error.message;
      }
      alert(errorMessage);
      console.error('Product save error:', error);
    }
  };

  if (loading) return <Typography>Loading products...</Typography>;

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpenDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setSelectedProduct(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <ProductForm 
            product={selectedProduct} 
            onSubmit={handleFormSubmit} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductList;
