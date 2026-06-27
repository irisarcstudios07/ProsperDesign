const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../middleware/asyncHandler');

const DEFAULT_TESTIMONIALS = [
  { clientName: 'PVR Group',            service: 'Exterior & Landscaping',      rating: 5, order: 1,  message: 'Our landscape and outdoor spaces were completed beautifully. The team maintained quality throughout the project and delivered everything on schedule.' },
  { clientName: 'Royal Icon',           service: 'Interior Designing',           rating: 5, order: 2,  message: 'The interior designing transformed our villa completely. Every detail was carefully planned and professionally executed.' },
  { clientName: 'PVR Classic',          service: 'Swimming Pools & Fountains',   rating: 5, order: 3,  message: 'The swimming pool and surrounding landscape became the highlight of our property. Excellent execution and finishing.' },
  { clientName: 'SLV',                  service: 'EPDM Flooring',                rating: 5, order: 4,  message: 'The EPDM flooring installation was completed perfectly. Highly durable, clean finishing and timely delivery.' },
  { clientName: 'Hotel Crab',           service: 'Interior Designing',           rating: 5, order: 5,  message: 'Our hotel interiors now have a premium appearance. Guests frequently compliment the design and the quality of craftsmanship.' },
  { clientName: 'Urban Meadows',        service: 'Exterior & Landscaping',       rating: 5, order: 6,  message: 'The landscaping work created a beautiful entrance for our community. Professional planning and flawless execution throughout.' },
  { clientName: 'Sky Towers',           service: 'Interior Designing',           rating: 5, order: 7,  message: 'The clubhouse interiors perfectly matched our expectations. Attention to detail was exceptional and timelines were respected.' },
  { clientName: 'Anandalahari',         service: 'Swimming Pools & Fountains',   rating: 5, order: 8,  message: 'The water feature and fountain completely transformed our project. Very satisfied with the craftsmanship and finishing.' },
  { clientName: 'Pride',                service: 'Exterior & Landscaping',       rating: 5, order: 9,  message: 'The exterior stone work and retaining walls were finished with great precision. Highly recommend the team.' },
  { clientName: 'Himaja Constructions', service: 'Construction',                 rating: 5, order: 10, message: 'We have partnered on multiple projects. Reliable workmanship and excellent coordination throughout every engagement.' },
  { clientName: 'Sresta Constructions', service: 'Construction',                 rating: 5, order: 11, message: 'The construction support and finishing quality were consistently outstanding. A true professional team.' },
  { clientName: 'End Avenue Serene',    service: 'Exterior & Landscaping',       rating: 5, order: 12, message: 'The landscape design added tremendous value to our residential project. Highly recommended for any premium estate.' },
];

// @desc  Get all visible testimonials (public)
// @route GET /api/testimonials
const getTestimonials = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { visible: true };
  const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: 1 });

  if (testimonials.length === 0) {
    return res.json({ success: true, message: 'Default testimonials returned', data: DEFAULT_TESTIMONIALS });
  }

  res.json({ success: true, message: 'Testimonials fetched', data: testimonials });
});

// @desc  Create testimonial (admin)
// @route POST /api/testimonials
const createTestimonial = asyncHandler(async (req, res) => {
  const { clientName, service, message, rating, order, visible } = req.body;
  const t = await Testimonial.create({
    clientName,
    service,
    message,
    rating: rating ?? 5,
    order:  order  ?? 0,
    visible: visible !== false && visible !== 'false'
  });
  res.status(201).json({ success: true, message: 'Testimonial created', data: t });
});

// @desc  Update testimonial (admin)
// @route PUT /api/testimonials/:id
const updateTestimonial = asyncHandler(async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Testimonial not found' });

  const { clientName, service, message, rating, order, visible } = req.body;
  if (clientName !== undefined) t.clientName = clientName;
  if (service     !== undefined) t.service     = service;
  if (message     !== undefined) t.message     = message;
  if (rating      !== undefined) t.rating      = Number(rating);
  if (order       !== undefined) t.order       = Number(order);
  if (visible     !== undefined) t.visible     = visible === true || visible === 'true';

  const updated = await t.save();
  res.json({ success: true, message: 'Testimonial updated', data: updated });
});

// @desc  Delete testimonial (admin)
// @route DELETE /api/testimonials/:id
const deleteTestimonial = asyncHandler(async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  await t.deleteOne();
  res.json({ success: true, message: 'Testimonial deleted', data: null });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
