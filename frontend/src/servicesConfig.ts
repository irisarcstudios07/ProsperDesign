export interface ServiceGalleryItem {
  title: string;
  image: string;
  description?: string;
}

export interface SubService {
  title: string;
  coverImage: string;
  items: ServiceGalleryItem[];
}

export interface ParentService {
  title: string;
  coverImage: string;
  subServices: SubService[];
}

export const servicesConfig: ParentService[] = [
  {
    title: 'Interior Designing',
    coverImage: '/InteriorDesigning/Bedrooms/cover.jpeg',
    subServices: [
      {
        title: 'Bedrooms',
        coverImage: '/InteriorDesigning/Bedrooms/cover.jpeg',
        items: [
          { title: 'Master Bedroom', image: '/InteriorDesigning/Bedrooms/Master bedroom.jpeg', description: 'Luxurious master bedroom with custom headboard and modern lighting.' },
          { title: 'Guest Bedroom', image: '/InteriorDesigning/Bedrooms/Guest bedroom.jpeg', description: 'Cozy and inviting guest room designed for premium comfort.' },
          { title: 'Small Bedroom', image: '/InteriorDesigning/Bedrooms/Small Bedroom.jpg', description: 'Space-optimized bedroom design maximizing utility and style.' },
          { title: 'Study Room', image: '/InteriorDesigning/Bedrooms/Study room.jpeg', description: 'Productive and peaceful study space with custom shelving.' },
          { title: 'Child Bedroom', image: '/InteriorDesigning/Bedrooms/child bedroom.jpeg', description: 'Playful yet organized bedroom space customized for kids.' },
        ],
      },
      {
        title: 'Club House Designing',
        coverImage: '/InteriorDesigning/Club House Designing/Cover.jpeg',
        items: [
          { title: 'Modern Club House', image: '/InteriorDesigning/Club House Designing/Modern Club house.jpeg', description: 'Sleek and contemporary community and club lounge interiors.' },
          { title: 'Rustic Lodge Club House', image: '/InteriorDesigning/Club House Designing/Rustic lodge club house design.jpeg', description: 'Warm timber and stone accents for a cozy club atmosphere.' },
          { title: 'Colonial Club House', image: '/InteriorDesigning/Club House Designing/colonial club house design.jpeg', description: 'Elegant and grand club house design with classical architecture.' },
        ],
      },
      {
        title: 'Grand Lobby Designs',
        coverImage: '/InteriorDesigning/Grand Lobby Designs/Cover.jpeg',
        items: [
          { title: 'Modern Hotel Lobby', image: '/InteriorDesigning/Grand Lobby Designs/modern hotel lobby design.jpeg', description: 'Spacious and welcoming entrance design for hotels and high-ends.' },
          { title: 'Partition Type Design', image: '/InteriorDesigning/Grand Lobby Designs/partition type design.jpeg', description: 'Artistic partition integration for aesthetic zoning inside lobbies.' },
        ],
      },
      {
        title: 'Home & Furniture Collection',
        coverImage: '/InteriorDesigning/Home& Furniture collection/Cover.jpeg',
        items: [
          { title: 'Minimalistic Furniture', image: '/InteriorDesigning/Home& Furniture collection/minimalistic furniture design.jpeg', description: 'Clean lines, neutral tones, and highly functional furniture design.' },
          { title: 'Maximalistic Furniture', image: '/InteriorDesigning/Home& Furniture collection/maximalistic furniture design.jpeg', description: 'Vibrant, detailed, and rich premium furniture accents.' },
          { title: 'Empire Style Furniture', image: '/InteriorDesigning/Home& Furniture collection/Empire style furniture design.jpeg', description: 'Classical and opulent wood furniture detailing.' },
          { title: 'Mission-Style Furniture', image: '/InteriorDesigning/Home& Furniture collection/Mission-Style Furniture.jpeg', description: 'Solid wood craft emphasizing simplicity and horizontal lines.' },
        ],
      },
      {
        title: 'Modern Kitchen Designing',
        coverImage: '/InteriorDesigning/Modern Kitchen designing/cover.jpeg',
        items: [
          { title: 'L-Shaped Modular Kitchen', image: '/InteriorDesigning/Modern Kitchen designing/L-Shaped Modular Kitchen Layout.jpeg', description: 'Efficient layout maximizing corner utility and workflow.' },
          { title: 'Open Kitchen Layout', image: '/InteriorDesigning/Modern Kitchen designing/Open  Kitchen Layout.jpeg', description: 'Modern open kitchen integrated beautifully with the dining space.' },
          { title: 'Parallel Shaped Kitchen', image: '/InteriorDesigning/Modern Kitchen designing/Parallel Shaped Modular Kitchen Layout.jpeg', description: 'Dual platform design optimizing counter space for cooking enthusiasts.' },
          { title: 'Straight Modular Kitchen', image: '/InteriorDesigning/Modern Kitchen designing/Straight Modular Kitchen Layout.jpeg', description: 'Compact and streamlined modular kitchen layout.' },
          { title: 'U-Shaped Modular Kitchen', image: '/InteriorDesigning/Modern Kitchen designing/U-Shaped Modular Kitchen Layout.jpeg', description: 'Maximum counter space and storage wrap-around kitchen design.' },
        ],
      },
      {
        title: 'Wardrobe Design',
        coverImage: '/InteriorDesigning/wardrobe design/Cover.jpeg',
        items: [
          { title: 'Sliding Door Wardrobe', image: '/InteriorDesigning/wardrobe design/sliding door wardrobe.jpeg', description: 'Space-saving sliding doors with high gloss reflective surfaces.' },
          { title: 'Swing Door Wardrobe', image: '/InteriorDesigning/wardrobe design/swing door wardrobe.jpeg', description: 'Classic hinged door wardrobes with premium hardware handles.' },
          { title: 'Walk-in Wardrobe', image: '/InteriorDesigning/wardrobe design/walk-in wardrobe.jpeg', description: 'Luxurious walk-in closet space with customizable shelving modules.' },
        ],
      },
    ],
  },
  {
    title: 'Exterior & Landscaping',
    coverImage: '/Exterrior & Landscaping/Garden&Landscaping/Cover.jpeg',
    subServices: [
      {
        title: '3D Wall Painting',
        coverImage: '/Exterrior & Landscaping/3D Wall painting/Cover.jpeg',
        items: [
          { title: 'Gold Geometric Wall Design', image: '/Exterrior & Landscaping/3D Wall painting/Gold Geometric Wall Design.jpeg', description: 'Intricate golden geometric wall patterns for modern spaces.' },
          { title: 'Trompe l oeil Wall Painting', image: '/Exterrior & Landscaping/3D Wall painting/Trompe l oeil wall painting.jpeg', description: 'Realistic 3D optical illusion murals transforming plain surfaces.' },
          { title: 'Traditional Chinese Pine Wall', image: '/Exterrior & Landscaping/3D Wall painting/raditional Chinese Welcoming Pine Wall.jpeg', description: 'Beautiful traditional welcoming pine tree mural.' },
          { title: 'East Asian Landscape Art', image: '/Exterrior & Landscaping/3D Wall painting/East Asian Landscape Art.jpeg', description: 'Scenic mountain and water paintings adding organic depth.' },
        ],
      },
      {
        title: 'Cricket Boxes',
        coverImage: '/Exterrior & Landscaping/Cricket Boxes/Cover.jpeg',
        items: [
          { title: 'Batting Cricket Box', image: '/Exterrior & Landscaping/Cricket Boxes/batting cricket box.jpeg', description: 'Premium caged netting for batting practice.' },
          { title: 'Bowling Cricket Box', image: '/Exterrior & Landscaping/Cricket Boxes/bowling cricket box.jpeg', description: 'Enclosed cricket net box with durable artificial turf.' },
        ],
      },
      {
        title: 'EPDM Flooring',
        coverImage: '/Exterrior & Landscaping/Epdm Flooring/Cover.jpeg',
        items: [
          { title: 'EDPM Rubber Flooring', image: '/Exterrior & Landscaping/Epdm Flooring/EDPM rubber flooring.jpeg', description: 'Shock-absorbing playground and sports safety flooring.' },
        ],
      },
      {
        title: 'Gabion Walls',
        coverImage: '/Exterrior & Landscaping/Gabion Walls/Cover.jpeg',
        items: [
          { title: 'Gabion Baskets', image: '/Exterrior & Landscaping/Gabion Walls/gabion baskets.jpeg', description: 'Rock-filled wire mesh baskets for sturdy retaining walls.' },
          { title: 'Gabion Mattresses', image: '/Exterrior & Landscaping/Gabion Walls/gabion matresses.jpeg', description: 'Flat wire baskets for erosion control and slope stabilization.' },
        ],
      },
      {
        title: 'Garden & Landscaping',
        coverImage: '/Exterrior & Landscaping/Garden&Landscaping/Cover.jpeg',
        items: [
          { title: 'English Garden', image: '/Exterrior & Landscaping/Garden&Landscaping/English garden.jpeg', description: 'Classic informal landscape with colorful flower beds and paths.' },
          { title: 'Japanese Garden', image: '/Exterrior & Landscaping/Garden&Landscaping/Japanese Garden.jpeg', description: 'Tranquil gardens featuring water elements, rocks, and bridges.' },
          { title: 'Mediterranean Garden', image: '/Exterrior & Landscaping/Garden&Landscaping/Mediterranean garden.jpeg', description: 'Drought-tolerant, warm textured garden designs.' },
          { title: 'Tropical Garden', image: '/Exterrior & Landscaping/Garden&Landscaping/Tropical garden.jpeg', description: 'Lush green foliage and exotic broadleaf plantings.' },
          { title: 'Formal Landscaping', image: '/Exterrior & Landscaping/Garden&Landscaping/formal landscaping.jpeg', description: 'Symmetrical patterns and neatly trimmed topiary designs.' },
          { title: 'Modern Landscaping', image: '/Exterrior & Landscaping/Garden&Landscaping/modern landscaping.jpeg', description: 'Clean lines, hardscaping focus, and architectural flora.' },
        ],
      },
      {
        title: 'Gym',
        coverImage: '/Exterrior & Landscaping/Gym/Cover.jpeg',
        items: [
          { title: 'Indoor Gym', image: '/Exterrior & Landscaping/Gym/Indoor gym.jpeg', description: 'Durable rubber flooring and optimal spacing for indoor workout gear.' },
          { title: 'Outdoor Gym', image: '/Exterrior & Landscaping/Gym/outdoor gym.jpeg', description: 'Weatherproof fitness installations for parks and yards.' },
        ],
      },
      {
        title: 'Indoor & Outdoor Playstation',
        coverImage: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Cover.jpeg',
        items: [
          { title: 'Soft Play Zone', image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Soft Play zone.jpeg', description: 'Safe indoor foam obstacle and play area for small children.' },
          { title: 'Indoor Climbing Walls', image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Indoor climbing walls.jpeg', description: 'Fun adventure walls fitted with safety harness lines.' },
          { title: 'Indoor Trampoline Park', image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Indoor trampoline parksz.jpeg', description: 'Wall-to-wall integrated trampoline layouts.' },
          { title: 'Child Park', image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Child Park.jpeg', description: 'Complete swings, slides, and outdoor play park design.' },
          { title: 'Outdoor Childs Park', image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Outdoor Childs  Park.jpeg', description: 'Premium community outdoor kids amusement layout.' },
          { title: 'Grass Tunnel', image: '/Exterrior & Landscaping/Indoor &outdoor Playstation/Grass tunnel.jpeg', description: 'Creative organic tunnels for active toddler play.' },
        ],
      },
      {
        title: 'Irrigation',
        coverImage: '/Exterrior & Landscaping/Irrigation/Cover.jpeg',
        items: [
          { title: 'Drip Irrigation & Micro Spray', image: '/Exterrior & Landscaping/Irrigation/Landscaper Drip Irrigation and Micro Spray.jpeg', description: 'Eco-friendly target watering systems saving water.' },
          { title: 'Soaker Hoses', image: '/Exterrior & Landscaping/Irrigation/Soaker hoses.jpeg', description: 'Porous pipes offering deep root hydration.' },
          { title: 'Micro Sprinklers', image: '/Exterrior & Landscaping/Irrigation/micro sprinklers.jpeg', description: 'Fine spray systems perfect for flowerbeds and groundcover.' },
        ],
      },
      {
        title: 'Swimming Pools',
        coverImage: '/Exterrior & Landscaping/Swiming Pools/Cover.jpeg',
        items: [
          { title: 'Infinity Pools', image: '/Exterrior & Landscaping/Swiming Pools/Infinity pools.jpeg', description: 'Stunning zero-edge swimming pools merging with the horizon.' },
          { title: 'Indoor Pool', image: '/Exterrior & Landscaping/Swiming Pools/Indoor pool.jpeg', description: 'Year-round climatized indoor pool designs with wellness options.' },
          { title: 'Rooftop Swimming Pool', image: '/Exterrior & Landscaping/Swiming Pools/Rooftop swimming pool.jpeg', description: 'Premium architectural rooftop pools with structural reinforces.' },
          { title: 'On-Ground Pool', image: '/Exterrior & Landscaping/Swiming Pools/On-ground pool.jpeg', description: 'Semi-permanent surface swimming pools with luxury wood decks.' },
        ],
      },
      {
        title: 'Water Bodies',
        coverImage: '/Exterrior & Landscaping/Water bodies/Cover.jpeg',
        items: [
          { title: 'Tiered Fountains', image: '/Exterrior & Landscaping/Water bodies/tiered fountains.jpeg', description: 'Elegant multi-level bubbling water fountains.' },
          { title: 'Disappearing Fountain', image: '/Exterrior & Landscaping/Water bodies/Disappearing fountain.jpeg', description: 'Safe rock-covered reservoir fountains without open pools.' },
          { title: 'Pond Fountain', image: '/Exterrior & Landscaping/Water bodies/Pond fountain.jpeg', description: 'Aerating fountains designed for garden and fish ponds.' },
          { title: 'Wall Fountain', image: '/Exterrior & Landscaping/Water bodies/wall fountain.jpeg', description: 'Space-saving vertical wall-hanging water feature.' },
        ],
      },
    ],
  },
];
