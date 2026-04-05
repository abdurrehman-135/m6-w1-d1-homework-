import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './Navbar';
import { API_BASE_URL } from './apiConfig';
import withRouter from './withRouter';

class InventoryEdit extends Component {
  emptyInventory = {
    prodname: '',
    qty: '',
    price: '',
    status: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyInventory
    };
  }

  async componentDidMount() {
    const inventoryId = this.props.match?.params?.id;

    if (inventoryId && inventoryId !== 'new') {
      const inventory = await (
        await fetch(`${API_BASE_URL}/api/inventory/${inventoryId}`)
      ).json();
      this.setState({ item: inventory });
    }
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const item = { ...this.state.item };

    item[name] = value;
    this.setState({ item });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { item } = this.state;

    await fetch(`${API_BASE_URL}/api/inventory`, {
      method: item._id ? 'PUT' : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    this.props.history.push('/inventories');
  };

  render() {
    const { item } = this.state;
    const title = (
      <h2 className="mt-3">
        {item._id ? 'Edit Inventory' : 'Add Inventory'}
      </h2>
    );

    return (
      <div>
        <AppNavbar />
        <Container>
          {title}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="prodname" className="h5 mt-3">
                Product Name
              </Label>
              <Input
                type="text"
                name="prodname"
                id="prodname"
                value={item.prodname || ''}
                onChange={this.handleChange}
                autoComplete="prodname"
              />
            </FormGroup>
            <FormGroup>
              <Label for="qty" className="h5 mt-3">
                Quantity
              </Label>
              <Input
                type="text"
                name="qty"
                id="qty"
                value={item.qty || ''}
                onChange={this.handleChange}
                autoComplete="qty"
              />
            </FormGroup>
            <FormGroup>
              <Label for="price" className="h5 mt-3">
                Price
              </Label>
              <Input
                type="text"
                name="price"
                id="price"
                value={item.price || ''}
                onChange={this.handleChange}
                autoComplete="price"
              />
            </FormGroup>
            <FormGroup>
              <Label for="status" className="h5 mt-3">
                Status
              </Label>
              <Input
                type="text"
                name="status"
                id="status"
                value={item.status || ''}
                onChange={this.handleChange}
                autoComplete="status"
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" type="submit" className="mt-3">
                Save
              </Button>{' '}
              <Button color="secondary" className="mt-3" tag={Link} to="/inventories">
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(InventoryEdit);
