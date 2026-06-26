// ── Static config for the public Services gallery page ───────────────────
// Images are served from /public folder (Vite static assets).
// This file is the source of truth for the public-facing portfolio browser.
// The Admin panel uses the MongoDB backend separately.

export interface GalleryImage {
  image: string;   // path relative to /public
  title: string;
  description?: string;
}

export interface SubService {
  title: string;
  coverImage: string;
  description: string;
  features?: string[];
  gallery: GalleryImage[];
}

export interface ParentService {
  title: string;
  coverImage: string;
  subServices: SubService[];
}

export const servicesConfig: ParentService[] = [
  /* ═══════════════════════════════════════════════════════════════
     INTERIOR DESIGNING
  ═══════════════════════════════════════════════════════════════ */
  {
    title: 'Interior Designing',
    coverImage: '/InteriorDesigning/cover.jpg',
    subServices: [
      {
        title: 'Bedrooms',
        coverImage: '/InteriorDesigning/Bedrooms/cover.jpeg',
        description: 'Luxurious and personalised bedroom interiors crafted for comfort, elegance, and restful living. From master suites to cosy child rooms, every space tells its own story.',
        features: ['Custom Headboards', 'Mood Lighting', 'Built-in Storage', 'Premium Finishes'],
        gallery: [
          { image: '/InteriorDesigning/Bedrooms/Master bedroom.jpeg', title: 'Master Bedroom', description: 'Luxurious master bedroom with custom headboard and modern lighting.' },
          { image: '/InteriorDesigning/Bedrooms/Guest bedroom.jpeg', title: 'Guest Bedroom', description: 'Cozy and inviting guest room designed for premium comfort.' },
          { image: '/InteriorDesigning/Bedrooms/Small Bedroom.jpg', title: 'Small Bedroom', description: 'Space-optimized bedroom design maximizing utility and style.' },
          { image: '/InteriorDesigning/Bedrooms/Study room.jpeg', title: 'Study Room', description: 'Productive and peaceful study space with custom shelving.' },
          { image: '/InteriorDesigning/Bedrooms/child bedroom.jpeg', title: 'Child Bedroom', description: 'Playful yet organized bedroom space customized for kids.' },
        ],
      },
      {
        title: 'Art Deco',
        coverImage: '/InteriorDesigning/Art Deco/Cover.jpeg',
        description: 'Bold geometric patterns, rich colours, and opulent materials define our Art Deco interiors. A timeless fusion of luxury and modernist design principles.',
        features: ['Geometric Patterns', 'Gold Accents', 'Rich Textures', 'Statement Lighting'],
        gallery: [
          { image: '/InteriorDesigning/Art Deco/Cover.jpeg', title: 'Art Deco Interior', description: 'Classic Art Deco design with bold geometric patterns and luxurious finishes.' },
        ],
      },
      {
        title: 'Classic Interior',
        coverImage: '/InteriorDesigning/Classic Interior/Cover.jpeg',
        description: 'Timeless elegance with traditional craftsmanship. Classic interiors feature ornate detailing, rich woods, and a warm, welcoming ambiance.',
        features: ['Ornate Mouldings', 'Rich Wood Finishes', 'Antique Accents', 'Warm Palettes'],
        gallery: [
          { image: '/InteriorDesigning/Classic Interior/Cover.jpeg', title: 'Classic Interior', description: 'Timeless classical interior with rich ornamental detailing.' },
        ],
      },
      {
        title: 'Club House Designing',
        coverImage: '/InteriorDesigning/Club House Designing/Cover.jpeg',
        description: 'Sophisticated community and leisure spaces that combine comfort with premium aesthetics. Perfect for residential complexes and corporate campuses.',
        features: ['Premium Lounges', 'Event-Ready Layout', 'Acoustic Design', 'Signature Lighting'],
        gallery: [
          { image: '/InteriorDesigning/Club House Designing/Modern Club house.jpeg', title: 'Modern Club House', description: 'Sleek and contemporary community and club lounge interiors.' },
          { image: '/InteriorDesigning/Club House Designing/Rustic lodge club house design.jpeg', title: 'Rustic Lodge Club House', description: 'Warm timber and stone accents for a cozy club atmosphere.' },
          { image: '/InteriorDesigning/Club House Designing/colonial club house design.jpeg', title: 'Colonial Club House', description: 'Elegant and grand club house design with classical architecture.' },
        ],
      },
      {
        title: 'Contemporary Interior',
        coverImage: '/InteriorDesigning/Contemporary Interior/Cover.jpeg',
        description: 'Clean lines, open spaces and a neutral palette define contemporary interiors. Functional art that adapts to modern living without sacrificing beauty.',
        features: ['Open Plan Living', 'Neutral Palettes', 'Natural Materials', 'Minimal Clutter'],
        gallery: [
          { image: '/InteriorDesigning/Contemporary Interior/Cover.jpeg', title: 'Contemporary Interior', description: 'Modern open-plan living with clean lines and natural materials.' },
        ],
      },
      {
        title: 'Grand Lobby Designs',
        coverImage: '/InteriorDesigning/Grand Lobby Designs/Cover.jpeg',
        description: 'Make a grand first impression with statement lobby designs. Expansive entrances crafted to set the tone for the entire building.',
        features: ['Statement Entrances', 'Branded Environments', 'Artistic Partitions', 'Premium Flooring'],
        gallery: [
          { image: '/InteriorDesigning/Grand Lobby Designs/modern hotel lobby design.jpeg', title: 'Modern Hotel Lobby', description: 'Spacious and welcoming entrance design for hotels and high-rise buildings.' },
          { image: '/InteriorDesigning/Grand Lobby Designs/partition type design.jpeg', title: 'Partition Type Design', description: 'Artistic partition integration for aesthetic zoning inside lobbies.' },
        ],
      },
      {
        title: 'Hollywood Glam Interior',
        coverImage: '/InteriorDesigning/Hollywood Glam Interior/Cover.jpeg',
        description: 'Dazzling, glamorous interiors inspired by old Hollywood. Think mirrored surfaces, velvet upholstery, and dramatic statement pieces.',
        features: ['Mirrored Accents', 'Velvet Upholstery', 'Crystal Chandeliers', 'Bold Contrasts'],
        gallery: [
          { image: '/InteriorDesigning/Hollywood Glam Interior/Cover.jpeg', title: 'Hollywood Glam', description: 'Dazzling Hollywood-inspired glamour with mirrored surfaces and rich velvet.' },
        ],
      },
      {
        title: 'Home & Furniture Collection',
        coverImage: '/InteriorDesigning/Home& Furniture collection/Cover.jpeg',
        description: 'Curated furniture collections that blend form and function. From minimalist pieces to grand statement furniture, every item is selected for impact.',
        features: ['Custom Upholstery', 'Solid Wood Crafts', 'Designer Pieces', 'Space Optimized'],
        gallery: [
          { image: '/InteriorDesigning/Home& Furniture collection/minimalistic furniture design.jpeg', title: 'Minimalistic Furniture', description: 'Clean lines, neutral tones, and highly functional furniture design.' },
          { image: '/InteriorDesigning/Home& Furniture collection/maximalistic furniture design.jpeg', title: 'Maximalistic Furniture', description: 'Vibrant, detailed, and rich premium furniture accents.' },
          { image: '/InteriorDesigning/Home& Furniture collection/Empire style furniture design.jpeg', title: 'Empire Style Furniture', description: 'Classical and opulent wood furniture detailing.' },
          { image: '/InteriorDesigning/Home& Furniture collection/Mission-Style Furniture.jpeg', title: 'Mission-Style Furniture', description: 'Solid wood craft emphasizing simplicity and horizontal lines.' },
        ],
      },
      {
        title: 'Industrial Interior',
        coverImage: '/InteriorDesigning/Industrial Interior/Cover.jpeg',
        description: 'Raw, edgy, and beautifully unfinished. Industrial interiors celebrate exposed brick, metal beams and concrete textures for a bold urban look.',
        features: ['Exposed Brick', 'Metal Accents', 'Concrete Textures', 'Open Ductwork'],
        gallery: [
          { image: '/InteriorDesigning/Industrial Interior/Cover.jpeg', title: 'Industrial Interior', description: 'Raw urban aesthetic with exposed brick, metal and concrete textures.' },
        ],
      },
      {
        title: 'Luxury Hotel Style',
        coverImage: '/InteriorDesigning/Luxury Hotel Style/Cover.jpeg',
        description: 'Five-star hotel aesthetics brought into residential and commercial spaces. Premium materials, impeccable service design, and refined elegance.',
        features: ['5-Star Aesthetics', 'Premium Materials', 'Spa-Like Bathrooms', 'Curated Artwork'],
        gallery: [
          { image: '/InteriorDesigning/Luxury Hotel Style/Cover.jpeg', title: 'Luxury Hotel Style', description: 'Five-star hotel aesthetics for residential and commercial spaces.' },
        ],
      },
      {
        title: 'Luxury Modern Interior',
        coverImage: '/InteriorDesigning/Luxury Modern Interior/Cover.jpeg',
        description: 'The pinnacle of contemporary luxury. Seamlessly blending modern minimalism with opulent materials for spaces that truly impress.',
        features: ['Marble Finishes', 'Smart Home Integration', 'Designer Lighting', 'Bespoke Joinery'],
        gallery: [
          { image: '/InteriorDesigning/Luxury Modern Interior/Cover.jpeg', title: 'Luxury Modern Interior', description: 'Contemporary luxury with marble, smart tech and bespoke finishes.' },
        ],
      },
      {
        title: 'Mid-Century Modern',
        coverImage: '/InteriorDesigning/Mid-Century Modern/Cover.jpeg',
        description: 'Celebrating the design revolution of the 1950s-60s. Clean organic forms, functional furniture, and a playful mix of traditional and non-traditional materials.',
        features: ['Organic Forms', 'Teak Wood', 'Retro Colour Pops', 'Functional Beauty'],
        gallery: [
          { image: '/InteriorDesigning/Mid-Century Modern/Cover.jpeg', title: 'Mid-Century Modern', description: 'Iconic 1950s-60s design with organic forms and functional elegance.' },
        ],
      },
      {
        title: 'Minimalist Interior',
        coverImage: '/InteriorDesigning/Minimalist Interior/Cover.jpeg',
        description: 'Less is more. Minimalist interiors focus on clean lines, uncluttered spaces, and a neutral palette that lets the architecture speak for itself.',
        features: ['Monochrome Palettes', 'Hidden Storage', 'Natural Light', 'Clean Geometry'],
        gallery: [
          { image: '/InteriorDesigning/Minimalist Interior/Cover.jpeg', title: 'Minimalist Interior', description: 'Serene uncluttered spaces with clean geometry and natural light.' },
        ],
      },
      {
        title: 'Modern Interior Design',
        coverImage: '/InteriorDesigning/Modern Interior Design/Cover.jpeg',
        description: 'A perfect balance of style and practicality. Modern interiors use the latest materials and trends to create spaces that are both beautiful and livable.',
        features: ['Contemporary Styling', 'Multi-functional Spaces', 'Tech Integration', 'Premium Finishes'],
        gallery: [
          { image: '/InteriorDesigning/Modern Interior Design/Cover.jpeg', title: 'Modern Interior Design', description: 'Contemporary and practical spaces with the latest materials and trends.' },
        ],
      },
      {
        title: 'Modern Kitchen Designing',
        coverImage: '/InteriorDesigning/Modern Kitchen designing/cover.jpeg',
        description: 'Modular kitchens designed for the modern chef. Ergonomic layouts, premium appliances, and beautiful finishes for your most-used room.',
        features: ['Modular Cabinets', 'Quartz Countertops', 'Smart Storage', 'Premium Appliances'],
        gallery: [
          { image: '/InteriorDesigning/Modern Kitchen designing/L-Shaped Modular Kitchen Layout.jpeg', title: 'L-Shaped Modular Kitchen', description: 'Efficient layout maximizing corner utility and workflow.' },
          { image: '/InteriorDesigning/Modern Kitchen designing/Open  Kitchen Layout.jpeg', title: 'Open Kitchen Layout', description: 'Modern open kitchen integrated beautifully with the dining space.' },
          { image: '/InteriorDesigning/Modern Kitchen designing/Parallel Shaped Modular Kitchen Layout.jpeg', title: 'Parallel Shaped Kitchen', description: 'Dual platform design optimizing counter space for cooking enthusiasts.' },
          { image: '/InteriorDesigning/Modern Kitchen designing/Straight Modular Kitchen Layout.jpeg', title: 'Straight Modular Kitchen', description: 'Compact and streamlined modular kitchen layout.' },
          { image: '/InteriorDesigning/Modern Kitchen designing/U-Shaped Modular Kitchen Layout.jpeg', title: 'U-Shaped Modular Kitchen', description: 'Maximum counter space and storage wrap-around kitchen design.' },
        ],
      },
      {
        title: 'Scandinavian Design',
        coverImage: '/InteriorDesigning/Scandinavian Design/Cover.jpeg',
        description: 'Nordic simplicity at its finest. Functional, cosy and beautifully understated design celebrating natural materials, light and hygge.',
        features: ['Hygge Aesthetics', 'Natural Wood', 'Soft Textiles', 'Neutral Tones'],
        gallery: [
          { image: '/InteriorDesigning/Scandinavian Design/Cover.jpeg', title: 'Scandinavian Design', description: 'Nordic simplicity with natural wood, soft textiles and neutral tones.' },
        ],
      },
      {
        title: 'Traditional Indian Interior',
        coverImage: '/InteriorDesigning/Traditional Indian Interior/Cover.jpeg',
        description: 'Rich cultural heritage expressed through vibrant colours, intricate carvings, and traditional craftsmanship. A celebration of India\'s design legacy.',
        features: ['Handcrafted Woodwork', 'Vibrant Textiles', 'Brass Accents', 'Ethnic Patterns'],
        gallery: [
          { image: '/InteriorDesigning/Traditional Indian Interior/Cover.jpeg', title: 'Traditional Indian Interior', description: 'Rich Indian heritage with handcrafted woodwork, vibrant textiles and brass accents.' },
        ],
      },
      {
        title: 'Victorian Interior',
        coverImage: '/InteriorDesigning/Victorian Interior/Cover.jpeg',
        description: 'Grand, ornate and richly decorated. Victorian interiors are characterized by dark wood, heavy fabrics, elaborate patterns, and a sense of aristocratic luxury.',
        features: ['Dark Rich Woods', 'Heavy Drapery', 'Ornate Patterns', 'Marble Fireplaces'],
        gallery: [
          { image: '/InteriorDesigning/Victorian Interior/Cover.jpeg', title: 'Victorian Interior', description: 'Grand ornate Victorian style with dark woods and elaborate detailing.' },
        ],
      },
      {
        title: 'Wardrobe Design',
        coverImage: '/InteriorDesigning/wardrobe design/Cover.jpeg',
        description: 'Custom wardrobe solutions that combine storage capacity with stunning aesthetics. Walk-in closets, sliding systems, and swing door designs tailored to your space.',
        features: ['Walk-in Closets', 'Sliding Systems', 'Built-in Lighting', 'Custom Organizers'],
        gallery: [
          { image: '/InteriorDesigning/wardrobe design/sliding door wardrobe.jpeg', title: 'Sliding Door Wardrobe', description: 'Space-saving sliding doors with high gloss reflective surfaces.' },
          { image: '/InteriorDesigning/wardrobe design/swing door wardrobe.jpeg', title: 'Swing Door Wardrobe', description: 'Classic hinged door wardrobes with premium hardware handles.' },
          { image: '/InteriorDesigning/wardrobe design/walk-in wardrobe.jpeg', title: 'Walk-in Wardrobe', description: 'Luxurious walk-in closet space with customizable shelving modules.' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     EXTERIOR & LANDSCAPING
  ═══════════════════════════════════════════════════════════════ */
  {
    title: 'Exterior & Landscaping',
    coverImage: '/Exterrior & Landscaping/cover.jpg',
    subServices: [
      {
        title: '3D Wall Painting',
        coverImage: '/Exterrior & Landscaping/3D Wall painting/Cover.jpeg',
        description: 'Transform blank walls into breathtaking three-dimensional masterpieces. Our artists create optical illusions, murals, and geometric artworks that redefine spaces.',
        features: ['Optical Illusions', 'Custom Murals', 'Geometric Art', 'Trompe-l\'oeil'],
        gallery: [
          { image: '/Exterrior & Landscaping/3D Wall painting/Gold Geometric Wall Design.jpeg', title: 'Gold Geometric Wall Design', description: 'Intricate golden geometric wall patterns for modern spaces.' },
          { image: '/Exterrior & Landscaping/3D Wall painting/Trompe l oeil wall painting.jpeg', title: 'Trompe l\'oeil Wall Painting', description: 'Realistic 3D optical illusion murals transforming plain surfaces.' },
          { image: '/Exterrior & Landscaping/3D Wall painting/raditional Chinese Welcoming Pine Wall.jpeg', title: 'Traditional Chinese Pine Wall', description: 'Beautiful traditional welcoming pine tree mural.' },
          { image: '/Exterrior & Landscaping/3D Wall painting/East Asian Landscape Art.jpeg', title: 'East Asian Landscape Art', description: 'Scenic mountain and water paintings adding organic depth.' },
        ],
      },
      {
        title: 'Cricket Boxes',
        coverImage: '/Exterrior & Landscaping/Cricket Boxes/Cover.jpeg',
        description: 'Premium cricket practice nets and enclosed boxes designed for serious players. Durable netting, professional-grade pitches, and safety-certified structures.',
        features: ['Professional Netting', 'Artificial Turf', 'Safety Certified', 'Weather Resistant'],
        gallery: [
          { image: '/Exterrior & Landscaping/Cricket Boxes/batting cricket box.jpeg', title: 'Batting Cricket Box', description: 'Premium caged netting for batting practice.' },
          { image: '/Exterrior & Landscaping/Cricket Boxes/bowling cricket box.jpeg', title: 'Bowling Cricket Box', description: 'Enclosed cricket net box with durable artificial turf.' },
        ],
      },
      {
        title: 'EPDM Flooring',
        coverImage: '/Exterrior & Landscaping/Epdm Flooring/Cover.jpeg',
        description: 'High-performance rubber flooring for playgrounds, gyms, and sports areas. Shock-absorbing, slip-resistant, and available in vibrant custom colours.',
        features: ['Shock Absorbing', 'Slip Resistant', 'Custom Colours', 'UV Stable'],
        gallery: [
          { image: '/Exterrior & Landscaping/Epdm Flooring/EDPM rubber flooring.jpeg', title: 'EPDM Rubber Flooring', description: 'Shock-absorbing playground and sports safety flooring.' },
        ],
      },
      {
        title: 'Gabion Walls',
        coverImage: '/Exterrior & Landscaping/Gabion Walls/Cover.jpeg',
        description: 'Natural stone and wire mesh retaining solutions. Gabion walls offer erosion control, slope stabilisation and an organic aesthetic for landscapes.',
        features: ['Erosion Control', 'Slope Stabilization', 'Natural Stone Fill', 'Eco-Friendly'],
        gallery: [
          { image: '/Exterrior & Landscaping/Gabion Walls/gabion baskets.jpeg', title: 'Gabion Baskets', description: 'Rock-filled wire mesh baskets for sturdy retaining walls.' },
          { image: '/Exterrior & Landscaping/Gabion Walls/gabion matresses.jpeg', title: 'Gabion Mattresses', description: 'Flat wire baskets for erosion control and slope stabilization.' },
        ],
      },
      {
        title: 'Garden & Landscaping',
        coverImage: '/Exterrior & Landscaping/Garden&Landscaping/Cover.jpeg',
        description: 'Complete garden design and landscaping from concept to completion. Japanese, Mediterranean, English, Tropical and more — each garden uniquely yours.',
        features: ['Custom Design', 'Seasonal Planting', 'Water Features', 'Sustainable Plants'],
        gallery: [
          { image: '/Exterrior & Landscaping/Garden&Landscaping/English garden1.jpeg', title: 'English Garden', description: 'Classic informal landscape with colorful flower beds and paths.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/English Garden2.jpeg', title: 'English Garden 2', description: 'Romantic cottage garden with climbing roses and herbaceous borders.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Japanese Garden 1.jpeg', title: 'Japanese Garden', description: 'Tranquil gardens featuring water elements, rocks, and bridges.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Japanese Garde 2.jpeg', title: 'Japanese Garden 2', description: 'Zen rock garden with moss, raked gravel and stone lanterns.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Mediterranean garden.jpeg', title: 'Mediterranean Garden', description: 'Drought-tolerant, warm textured garden designs.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Mediterranean Garden2.jpeg', title: 'Mediterranean Garden 2', description: 'Sun-drenched terrace with terracotta pots and olive trees.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Mediterranean Garden3.jpeg', title: 'Mediterranean Garden 3', description: 'Lavender and rosemary borders with stone pathways.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Tropical garden1.jpeg', title: 'Tropical Garden', description: 'Lush green foliage and exotic broadleaf plantings.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Tropical Garden2.jpeg', title: 'Tropical Garden 2', description: 'Palm trees and bold tropical foliage for a paradise feel.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Tropical Garden3.jpeg', title: 'Tropical Garden 3', description: 'Jungle-inspired planting with water features and timber decking.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/formal landscaping 1.jpeg', title: 'Formal Landscaping', description: 'Symmetrical patterns and neatly trimmed topiary designs.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/formal landscaping 2.jpeg', title: 'Formal Landscaping 2', description: 'Clipped hedges and geometric beds in the French parterre style.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/modern landscaping.jpeg', title: 'Modern Landscaping', description: 'Clean lines, hardscaping focus, and architectural flora.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Desert Xeriscape Garden1.jpeg', title: 'Desert Xeriscape Garden', description: 'Water-wise desert landscape with cacti and succulents.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Desert Xeriscape Garden2.jpeg', title: 'Desert Xeriscape 2', description: 'Gravel mulch and drought-tolerant plants for arid climates.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Desert Xeriscape Garden3.jpeg', title: 'Desert Xeriscape 3', description: 'Sculptural agave and boulders in a xeriscape setting.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Informal Garden1.jpg', title: 'Informal Garden', description: 'Relaxed cottage-style planting with naturalistic drifts.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Informal Garden2.webp', title: 'Informal Garden 2', description: 'Meandering paths through wildflower meadows and shrubs.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Minimalist Garden1.jpeg', title: 'Minimalist Garden', description: 'Clean geometric spaces with restrained planting and gravel.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Minimalist Garden2.jpeg', title: 'Minimalist Garden 2', description: 'Sculptural topiary and symmetry in a minimalist setting.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Minimalist Garden3.jpeg', title: 'Minimalist Garden 3', description: 'Zen-inspired minimalist landscape with stone and grass.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Roof top Garden1.jpg', title: 'Rooftop Garden', description: 'Lush green rooftop retreat above the city skyline.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Roof top Garden2.jpeg', title: 'Rooftop Garden 2', description: 'Urban rooftop terrace with raised planter beds.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/Roof top Garden3.jpg', title: 'Rooftop Garden 3', description: 'Sky-garden with outdoor seating and panoramic views.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/vertical garden1.jpeg', title: 'Vertical Garden', description: 'Living wall installations for compact outdoor spaces.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/vertical garden2.jpeg', title: 'Vertical Garden 2', description: 'Lush green wall cascades of ferns and trailing plants.' },
          { image: '/Exterrior & Landscaping/Garden&Landscaping/vertical garden3.jpeg', title: 'Vertical Garden 3', description: 'Modular planter system for indoor and outdoor vertical gardens.' },
        ],
      },
      {
        title: 'Gym',
        coverImage: '/Exterrior & Landscaping/Gym/Cover.jpeg',
        description: 'Professional gym installations for homes, residential communities and corporate spaces. Indoor and outdoor fitness areas with durable flooring and weatherproof equipment.',
        features: ['Rubber Flooring', 'Weatherproof Equipment', 'Mirrors & Lighting', 'Custom Layout'],
        gallery: [
          { image: '/Exterrior & Landscaping/Gym/Indoor gym.jpeg', title: 'Indoor Gym', description: 'Durable rubber flooring and optimal spacing for indoor workout gear.' },
          { image: '/Exterrior & Landscaping/Gym/outdoor gym.jpeg', title: 'Outdoor Gym', description: 'Weatherproof fitness installations for parks and yards.' },
        ],
      },
      {
        title: 'Indoor & Outdoor Playstation',
        coverImage: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Cover.jpeg',
        description: 'Safe and exciting play environments for children. From indoor soft play zones and climbing walls to outdoor parks and grass tunnels — we build memorable play experiences.',
        features: ['Safety Certified', 'Age-Appropriate', 'Durable Materials', 'Custom Themes'],
        gallery: [
          { image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Soft Play zone.jpeg', title: 'Soft Play Zone', description: 'Safe indoor foam obstacle and play area for small children.' },
          { image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Indoor climbing walls.jpeg', title: 'Indoor Climbing Walls', description: 'Fun adventure walls fitted with safety harness lines.' },
          { image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Indoor trampoline parksz.jpeg', title: 'Indoor Trampoline Park', description: 'Wall-to-wall integrated trampoline layouts.' },
          { image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Child Park.jpeg', title: 'Child Park', description: 'Complete swings, slides, and outdoor play park design.' },
          { image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Outdoor Childs  Park.jpeg', title: 'Outdoor Childs Park', description: 'Premium community outdoor kids amusement layout.' },
          { image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Grass tunnel.jpeg', title: 'Grass Tunnel', description: 'Creative organic tunnels for active toddler play.' },
        ],
      },
      {
        title: 'Irrigation',
        coverImage: '/Exterrior & Landscaping/Irrigation/Cover.jpeg',
        description: 'Smart, water-efficient irrigation systems for gardens, sports fields, and large landscapes. We design drip, sprinkler, and micro-spray systems that conserve water while keeping your landscape lush.',
        features: ['Drip Irrigation', 'Smart Controllers', 'Water Conservation', 'Low Maintenance'],
        gallery: [
          { image: '/Exterrior & Landscaping/Irrigation/Landscaper Drip Irrigation and Micro Spray.jpeg', title: 'Drip Irrigation & Micro Spray', description: 'Eco-friendly target watering systems saving water.' },
          { image: '/Exterrior & Landscaping/Irrigation/Soaker hoses.jpeg', title: 'Soaker Hoses', description: 'Porous pipes offering deep root hydration.' },
          { image: '/Exterrior & Landscaping/Irrigation/micro sprinklers.jpeg', title: 'Micro Sprinklers', description: 'Fine spray systems perfect for flowerbeds and groundcover.' },
        ],
      },
      {
        title: 'Swimming Pools',
        coverImage: '/Exterrior & Landscaping/Swiming Pools/Cover.jpeg',
        description: 'From rooftop infinity pools to private indoor sanctuaries, we design and build premium swimming pools with the finest materials and engineering.',
        features: ['Infinity Edge', 'Mosaic Tiling', 'LED Lighting', 'Filtration Systems'],
        gallery: [
          { image: '/Exterrior & Landscaping/Swiming Pools/Infinity pools.jpeg', title: 'Infinity Pools', description: 'Stunning zero-edge swimming pools merging with the horizon.' },
          { image: '/Exterrior & Landscaping/Swiming Pools/Indoor pool.jpeg', title: 'Indoor Pool', description: 'Year-round climatized indoor pool designs with wellness options.' },
          { image: '/Exterrior & Landscaping/Swiming Pools/Rooftop swimming pool.jpeg', title: 'Rooftop Swimming Pool', description: 'Premium architectural rooftop pools with structural reinforcements.' },
          { image: '/Exterrior & Landscaping/Swiming Pools/On-ground pool.jpeg', title: 'On-Ground Pool', description: 'Semi-permanent surface swimming pools with luxury wood decks.' },
        ],
      },
      {
        title: 'Water Bodies',
        coverImage: '/Exterrior & Landscaping/Water bodies/Cover.jpeg',
        description: 'Ornamental water features that bring serenity and life to any landscape. Fountains, ponds, waterfalls, and wall features — hand-crafted to perfection.',
        features: ['Custom Fountains', 'Natural Ponds', 'LED Illumination', 'Low Maintenance'],
        gallery: [
          { image: '/Exterrior & Landscaping/Water bodies/tiered fountains.jpeg', title: 'Tiered Fountains', description: 'Elegant multi-level bubbling water fountains.' },
          { image: '/Exterrior & Landscaping/Water bodies/Disappearing fountain.jpeg', title: 'Disappearing Fountain', description: 'Safe rock-covered reservoir fountains without open pools.' },
          { image: '/Exterrior & Landscaping/Water bodies/Pond fountain.jpeg', title: 'Pond Fountain', description: 'Aerating fountains designed for garden and fish ponds.' },
          { image: '/Exterrior & Landscaping/Water bodies/wall fountain.jpeg', title: 'Wall Fountain', description: 'Space-saving vertical wall-hanging water feature.' },
        ],
      },
    ],
  },
];
