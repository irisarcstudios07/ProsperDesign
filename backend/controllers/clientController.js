const Client = require('../models/Client');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all clients (sorted by order)
// @route   GET /api/clients
const getClients = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.active === 'true') {
    query.active = true;
  }
  const clients = await Client.find(query).sort({ order: 1 });
  res.json({ success: true, message: 'Clients fetched successfully', data: clients });
});

// @desc    Create a new client
// @route   POST /api/clients
const createClient = asyncHandler(async (req, res) => {
  const { name, order, active } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Client name is required' });
  }

  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null) {
    // Determine the next order index
    const lastClient = await Client.findOne().sort({ order: -1 });
    finalOrder = lastClient ? lastClient.order + 1 : 0;
  }

  const client = new Client({
    name: name.trim(),
    order: finalOrder,
    active: active !== undefined ? active : true
  });

  const savedClient = await client.save();
  res.status(201).json({ success: true, message: 'Client created successfully', data: savedClient });
});

// @desc    Update a client
// @route   PUT /api/clients/:id
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  const { name, order, active } = req.body;

  if (name !== undefined) client.name = name.trim();
  if (order !== undefined) client.order = Number(order);
  if (active !== undefined) client.active = Boolean(active);

  const updatedClient = await client.save();
  res.json({ success: true, message: 'Client updated successfully', data: updatedClient });
});

// @desc    Delete a client
// @route   DELETE /api/clients/:id
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  const deletedOrder = client.order;
  await client.deleteOne();

  // Shift subsequent orders down by 1 to maintain contiguous indices
  await Client.updateMany(
    { order: { $gt: deletedOrder } },
    { $inc: { order: -1 } }
  );

  res.json({ success: true, message: 'Client deleted successfully', data: null });
});

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient
};
