export interface Category {
  slug: string;
  name: string;
  short: string;
  icon: string;
  image: string;
  color: string;
  description: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  detail: string;
  price: number;
  old: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  age: string;
  sizes: string[];
  colors: string[];
  tag: string;
  isNew: boolean;
  features: string[];
}

export interface AgeGroup {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  age: string;
  color: string;
  description: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  image: string;
  minutes: number;
  excerpt: string;
  sections: [string, string][];
}

export const categories: Category[] = [
  { slug: 'clothing', name: 'Baby Clothing', short: 'Clothing', icon: 'shirt', image: 'clothing', color: 'pink-bg', description: 'Soft little outfits for cuddles, first steps, and everything in between.' },
  { slug: 'diapering', name: 'Diapering', short: 'Diapering', icon: 'heart', image: 'wipes', color: 'blue-bg', description: 'Gentle everyday essentials that make changing time a little easier.' },
  { slug: 'feeding', name: 'Feeding', short: 'Feeding', icon: 'bottle', image: 'feeding', color: 'yellow-bg', description: 'Little spoons, happy tummies. Discover thoughtfully chosen mealtime essentials.' },
  { slug: 'bath-care', name: 'Bath & Care', short: 'Bath & Care', icon: 'bath', image: 'bath', color: 'mint-bg', description: 'A little splash, a little care, and a whole lot of happy bath times.' },
  { slug: 'toys', name: 'Toys & Play', short: 'Toys', icon: 'toy', image: 'toys', color: 'yellow-bg', description: 'A world of wonder, made for curious little hands and big imaginations.' },
  { slug: 'mom-baby', name: 'Mom & Baby', short: 'Mom & Baby', icon: 'heart', image: 'mom', color: 'pink-bg', description: 'A little comfort for the person who gives so much. Essentials for your new chapter.' },
  { slug: 'health-safety', name: 'Health & Safety', short: 'Health', icon: 'shield', image: 'health', color: 'blue-bg', description: 'Thoughtful little helpers for a more comfortable everyday routine.' },
  { slug: 'nursery', name: 'Nursery', short: 'Nursery', icon: 'moon', image: 'nursery', color: 'mint-bg', description: 'Create a cozy little corner for the sweetest beginnings.' }
];

export const products: Product[] = [
  {
    id: 1,
    slug: 'organic-cotton-romper',
    name: 'Organic Cotton Romper',
    detail: 'Everyday softness, from the very first cuddle',
    price: 599,
    old: 799,
    category: 'clothing',
    image: 'clothing',
    rating: 4.8,
    reviews: 124,
    brand: 'KIDOBOX',
    age: '0-6',
    sizes: ['0–3 months', '3–6 months', '6–9 months', '9–12 months'],
    colors: ['Blush Pink', 'Cloud Cream', 'Sky Blue'],
    tag: 'Bestseller',
    isNew: false,
    features: ['Soft organic cotton fabric', 'Easy snap-button changes', 'Gentle stretch for little wriggles', 'Machine washable, made for everyday wear']
  },
  {
    id: 2,
    slug: 'soft-touch-baby-wipes',
    name: 'Soft Touch Baby Wipes',
    detail: 'Gentle wipes for life’s little messes',
    price: 249,
    old: 349,
    category: 'diapering',
    image: 'wipes',
    rating: 4.7,
    reviews: 93,
    brand: 'Pampers',
    age: '0-6',
    sizes: ['Single Pack', 'Pack of 3'],
    colors: [],
    tag: 'Parent Favorite',
    isNew: false,
    features: ['Soft, textured wipes', 'Resealable pack for everyday use', 'Convenient at home or on the go', 'Store away from heat and direct sunlight']
  },
  {
    id: 3,
    slug: 'silicone-feeding-set',
    name: 'Silicone Feeding Set',
    detail: 'A happy little start to mealtimes',
    price: 799,
    old: 999,
    category: 'feeding',
    image: 'feeding',
    rating: 4.8,
    reviews: 110,
    brand: 'KIDOBOX',
    age: '6-12',
    sizes: ['One Size'],
    colors: ['Sage Green', 'Blush Pink', 'Sand'],
    tag: 'Bestseller',
    isNew: false,
    features: ['Soft-touch silicone mealtime essentials', 'Easy-to-hold spoon for little hands', 'A practical everyday bowl', 'Wash thoroughly before first use']
  },
  {
    id: 4,
    slug: 'cuddle-bunny-plush',
    name: 'Cuddle Bunny Plush Toy',
    detail: 'A floppy-eared friend for little adventures',
    price: 499,
    old: 699,
    category: 'toys',
    image: 'toys',
    rating: 4.9,
    reviews: 165,
    brand: 'KIDOBOX',
    age: '1-2',
    sizes: ['Small', 'Medium'],
    colors: ['Blush Pink', 'Oatmeal'],
    tag: 'Bestseller',
    isNew: false,
    features: ['Soft plush texture', 'A lovely gift for little ones', 'Lightweight and easy to carry', 'Adult supervision recommended; follow the item’s age label']
  },
  {
    id: 5,
    slug: 'happy-splash-bath-set',
    name: 'Happy Splash Bath Set',
    detail: 'Turn everyday splashes into little smiles',
    price: 449,
    old: 599,
    category: 'bath-care',
    image: 'bath',
    rating: 4.8,
    reviews: 81,
    brand: 'Mee Mee',
    age: '6-12',
    sizes: ['One Size'],
    colors: ['Sunshine Yellow', 'Peach'],
    tag: 'New',
    isNew: true,
    features: ['Cheerful bath-time essentials', 'Easy-to-hold shapes', 'Rinse and dry after each use', 'Always supervise children near water']
  },
  {
    id: 6,
    slug: 'mama-comfort-essentials',
    name: 'Mama Comfort Maternity Dress',
    detail: 'Beautifully soft, through every chapter',
    price: 1299,
    old: 1599,
    category: 'mom-baby',
    image: 'mom',
    rating: 4.8,
    reviews: 62,
    brand: 'KIDOBOX',
    age: 'all',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Natural Cream', 'Blush'],
    tag: 'New',
    isNew: true,
    features: ['Designed around everyday comfort', 'Soft, neutral styling', 'A thoughtful new-parent gift', 'Easy care for busy days']
  },
  {
    id: 7,
    slug: 'baby-care-thermometer',
    name: 'Baby Care Thermometer',
    detail: 'A helpful addition to your family care kit',
    price: 699,
    old: 899,
    category: 'health-safety',
    image: 'health',
    rating: 4.7,
    reviews: 77,
    brand: 'Chicco',
    age: '0-6',
    sizes: ['One Size'],
    colors: ['Sky Blue', 'White'],
    tag: 'Everyday Essential',
    isNew: false,
    features: ['Clear, easy-to-read display', 'Compact design for your care kit', 'Follow the manufacturer’s directions', 'Consult your pediatrician for health concerns']
  },
  {
    id: 8,
    slug: 'dreamy-days-nursery',
    name: 'Dreamy Days Nursery Crib',
    detail: 'A calm little corner for the sweetest beginnings',
    price: 8999,
    old: 10999,
    category: 'nursery',
    image: 'nursery',
    rating: 4.9,
    reviews: 48,
    brand: 'KIDOBOX',
    age: '0-6',
    sizes: ['Standard'],
    colors: ['Natural Wood', 'Cloud White'],
    tag: 'New',
    isNew: true,
    features: ['Timeless nursery styling', 'A warm, natural palette', 'Check dimensions before ordering', 'Assembly information supplied with the product']
  },
  {
    id: 9,
    slug: 'blossom-bodysuit-set',
    name: 'Blossom Bodysuit & Bonnet',
    detail: 'A little bloom for your little love',
    price: 899,
    old: 1199,
    category: 'clothing',
    image: 'clothing2',
    rating: 4.9,
    reviews: 54,
    brand: 'Babyhug',
    age: '0-6',
    sizes: ['0–3 months', '3–6 months', '6–9 months'],
    colors: ['Blush Floral'],
    tag: 'New',
    isNew: true,
    features: ['Soft floral cotton fabric', 'Matching bonnet included', 'Sweet detailing for everyday moments', 'Machine wash with similar colors']
  },
  {
    id: 10,
    slug: 'cloud-soft-baby-diapers',
    name: 'Cloud Soft Baby Diapers',
    detail: 'Everyday comfort for busy little days',
    price: 649,
    old: 849,
    category: 'diapering',
    image: 'diapers',
    rating: 4.8,
    reviews: 136,
    brand: 'Huggies',
    age: '6-12',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [],
    tag: 'Bestseller',
    isNew: false,
    features: ['Soft everyday diaper essentials', 'Easy-to-use fastening', 'Select the size appropriate for your baby', 'Change regularly and follow pack guidance']
  },
  {
    id: 11,
    slug: 'peach-feeding-bottles',
    name: 'Peach Feeding Bottle Duo',
    detail: 'A sweet little pair for the everyday routine',
    price: 999,
    old: 1299,
    category: 'feeding',
    image: 'feeding2',
    rating: 4.8,
    reviews: 86,
    brand: 'Philips Avent',
    age: '0-6',
    sizes: ['Duo Set'],
    colors: ['Peach'],
    tag: 'New',
    isNew: true,
    features: ['Two coordinating feeding bottles', 'Easy-to-read measurement markings', 'A practical gift for new parents', 'Clean and prepare according to product instructions']
  },
  {
    id: 12,
    slug: 'pastel-rainbow-stacker',
    name: 'Pastel Wooden Rainbow',
    detail: 'Little pieces. Endless possibilities.',
    price: 1199,
    old: 1599,
    category: 'toys',
    image: 'toys2',
    rating: 4.9,
    reviews: 71,
    brand: 'Fisher-Price',
    age: '2+',
    sizes: ['One Size'],
    colors: ['Pastel Rainbow'],
    tag: 'New',
    isNew: true,
    features: ['Colorful wooden stacking arches', 'Open-ended play possibilities', 'A beautiful addition to the play shelf', 'Follow the age label and supervise play']
  },
  {
    id: 13,
    slug: 'cloud-cotton-towel-set',
    name: 'Cloud Cotton Towel Set',
    detail: 'Wrap up the little moments in softness',
    price: 799,
    old: 999,
    category: 'bath-care',
    image: 'bath2',
    rating: 4.8,
    reviews: 64,
    brand: 'Johnson’s',
    age: '0-6',
    sizes: ['Set of 3'],
    colors: ['Cloud Cream'],
    tag: 'Parent Favorite',
    isNew: false,
    features: ['Soft cotton towel collection', 'Gentle everyday texture', 'A practical nursery essential', 'Wash before first use']
  },
  {
    id: 14,
    slug: 'mama-everyday-backpack',
    name: 'Mama Everyday Backpack',
    detail: 'A little organization for life on the go',
    price: 1899,
    old: 2499,
    category: 'mom-baby',
    image: 'mom2',
    rating: 4.9,
    reviews: 59,
    brand: 'KIDOBOX',
    age: 'all',
    sizes: ['One Size'],
    colors: ['Blush Pink'],
    tag: 'New',
    isNew: true,
    features: ['Thoughtfully arranged compartments', 'Comfortable shoulder straps', 'Room for your everyday essentials', 'Wipe clean according to the care label']
  },
  {
    id: 15,
    slug: 'little-care-grooming-set',
    name: 'Little Care Grooming Set',
    detail: 'Tiny details, gently taken care of',
    price: 549,
    old: 699,
    category: 'health-safety',
    image: 'health2',
    rating: 4.7,
    reviews: 45,
    brand: 'Mee Mee',
    age: '0-6',
    sizes: ['One Size'],
    colors: ['Natural Wood'],
    tag: 'Everyday Essential',
    isNew: false,
    features: ['A coordinated everyday grooming kit', 'Soft brush and easy-grip comb', 'Keep clean and dry between uses', 'Adult use only; store out of children’s reach']
  },
  {
    id: 16,
    slug: 'little-dreamer-bassinet',
    name: 'Little Dreamer Bassinet',
    detail: 'Natural textures for their first little corner',
    price: 6499,
    old: 7999,
    category: 'nursery',
    image: 'nursery2',
    rating: 4.9,
    reviews: 32,
    brand: 'KIDOBOX',
    age: '0-6',
    sizes: ['Standard'],
    colors: ['Natural Rattan'],
    tag: 'New',
    isNew: true,
    features: ['Warm natural rattan styling', 'A beautiful nursery focal point', 'Follow all supplied assembly guidance', 'Check the manufacturer’s age and weight limits']
  }
];

export const ages: AgeGroup[] = [
  { slug: 'newborn', title: '0–6 Months', subtitle: 'Newborn Care', image: 'newborn', age: '0-6', color: 'yellow-bg', description: 'The softest beginnings. Discover little essentials for your very first moments together.' },
  { slug: 'baby', title: '6–12 Months', subtitle: 'Growth & Exploration', image: 'baby', age: '6-12', color: 'blue-bg', description: 'New tastes, new discoveries, and so many firsts. Essentials for a growing little explorer.' },
  { slug: 'toddler', title: '1–2 Years', subtitle: 'Active Toddlers', image: 'toddler', age: '1-2', color: 'yellow-bg', description: 'Made for busy little hands, curious minds, and those very first adventures.' },
  { slug: 'kids', title: '2+ Years', subtitle: 'Little Explorers', image: 'kid', age: '2+', color: 'mint-bg', description: 'Big imaginations start small. Find playful favorites for their next chapter.' }
];

export const articles: Article[] = [
  {
    slug: 'newborn-essentials-checklist',
    title: 'Your Little One’s First Wardrobe: A Simple Checklist',
    category: 'NEWBORN CARE',
    image: 'blog1',
    minutes: 5,
    excerpt: 'A gentle guide to choosing comfortable everyday pieces for your baby’s earliest days.',
    sections: [
      ['Start with the everyday pieces', 'A few comfortable rompers, soft socks, and easy layers can make a lovely starting point. Think about the weather, your laundry routine, and the outfits you will reach for most often. You can always add more once you learn what works for your family.'],
      ['Choose comfort and convenience', 'Look for soft fabrics, smooth seams, and fastenings that make changes easier. A slightly roomy fit gives your little one freedom to move. Check the size guide and care label before choosing.'],
      ['Build a small, practical rotation', 'Organize the drawer by size and type so you can find a fresh outfit quickly. Keep a spare set in your changing bag. Simple colors and prints are easy to mix, match, and pass along.'],
      ['Leave room for little discoveries', 'Every family’s routine looks a little different. Start simply and make your collection your own. A thoughtfully chosen wardrobe is about comfort, not having one of everything.']
    ]
  },
  {
    slug: 'happy-little-mealtimes',
    title: 'Little Spoons, Big Discoveries: Setting Up for Mealtimes',
    category: 'FEEDING',
    image: 'blog2',
    minutes: 4,
    excerpt: 'Practical ways to make the everyday mealtime setup calmer, simpler, and easier to clean.',
    sections: [
      ['Create a calm little space', 'Choose a convenient place for everyday meals and keep your essential items nearby. A bowl, an easy-to-hold spoon, and a wipe-clean surface can help make the routine feel manageable.'],
      ['Choose everyday tools thoughtfully', 'Think about grip, weight, cleaning, and storage when choosing feeding accessories. Check the manufacturer’s age guidance and care instructions. Your pediatrician can advise when your baby is ready for different feeding stages.'],
      ['Keep the cleanup simple', 'Set aside a small basket for clean bibs, spoons, and cloths. Wash feeding items according to their instructions and let them dry completely. A simple routine means a little more time for the moments that matter.'],
      ['Enjoy the shared moments', 'There is plenty to discover at the table. Make space for everyday connection, and remember that progress looks different for every child. Always supervise your little one during meals.']
    ]
  },
  {
    slug: 'choosing-playtime-favorites',
    title: 'How to Choose Playtime Favorites for Curious Little Minds',
    category: 'PLAY & DEVELOPMENT',
    image: 'blog3',
    minutes: 5,
    excerpt: 'Thoughtful toy shopping starts with the little things your child loves to explore.',
    sections: [
      ['Follow their curiosity', 'Notice the shapes, textures, and activities your child returns to. A few well-chosen favorites can invite lots of different kinds of play. Look for toys that feel suited to their current interests.'],
      ['Read the age label', 'Choose toys with an age recommendation that fits your child. Inspect pieces regularly and follow the maker’s care and safety instructions. Put damaged toys aside and supervise play as appropriate.'],
      ['Try a simple toy rotation', 'Keep a small selection within easy reach and store the rest away. Swapping the selection from time to time can make familiar toys feel interesting again, while helping the play area stay tidy.'],
      ['Make room for shared play', 'A story, a silly voice, or a few minutes of your attention can turn a familiar toy into a new adventure. The best playtime is often a little less planned and a little more together.']
    ]
  },
  {
    slug: 'dreamy-nursery-details',
    title: 'Small Details That Make a Nursery Feel Like Home',
    category: 'NURSERY',
    image: 'nursery',
    minutes: 4,
    excerpt: 'Soft colors, useful storage, and a few personal touches for a space that grows with your family.',
    sections: [
      ['Begin with the feeling', 'Choose a small palette that feels calm and welcoming to you. Cream, blush, sage, and warm wood tones are easy to combine. A few favorite colors can tie the whole room together.'],
      ['Make space for the everyday routine', 'Think through where you will keep clothing, changing essentials, and books. Practical storage within easy reach can make small daily tasks feel a little smoother. Secure furniture according to the manufacturer’s guidance.'],
      ['Add a personal little touch', 'A favorite print, a family photograph, or a tiny shelf of books can give the space its own story. Keep decorations clear of the baby’s sleeping space and follow current local safe-sleep guidance.'],
      ['Let the room grow slowly', 'You do not need to finish every detail at once. Let your routine and your little one’s changing interests guide the next additions. A lived-in, much-loved room is beautiful in its own way.']
    ]
  },
  {
    slug: 'changing-bag-checklist',
    title: 'The Everyday Changing Bag: A Less-Is-More Checklist',
    category: 'EVERYDAY PARENTING',
    image: 'wipes',
    minutes: 3,
    excerpt: 'A small collection of practical essentials for your next little outing.',
    sections: [
      ['Pack for your usual outing', 'Think about the length of your trip and what you normally need. A few diapers, wipes, a changing mat, and a spare outfit make a useful starting point. Adjust the list for your own family.'],
      ['Give everything a place', 'Use small pouches or compartments to keep clean clothes, changing items, and little extras separate. The easier something is to find, the easier it is to get out the door.'],
      ['Reset when you return', 'Replace what you used and check for anything that needs washing. A quick reset after an outing can save time before the next one.'],
      ['Keep it comfortable to carry', 'A lighter bag can make a big difference to your day. Review the contents regularly and take out things you rarely use. Your everyday essentials can change as your little one grows.']
    ]
  },
  {
    slug: 'gifting-for-little-arrivals',
    title: 'A Little Gift Guide for Beautiful New Beginnings',
    category: 'GIFTING',
    image: 'clothing',
    minutes: 4,
    excerpt: 'Thoughtful ways to celebrate a new arrival, with comfort and everyday usefulness in mind.',
    sections: [
      ['Choose something useful and lovely', 'A soft outfit, a carefully chosen nursery detail, or a practical everyday essential can make a thoughtful gift. Consider the family’s preferences and the season when choosing.'],
      ['Consider the next size up', 'Babies grow quickly, and families may already have plenty of newborn pieces. An outfit in a later size can be a welcome addition to the drawer. Include a gift receipt when available.'],
      ['Think of the parents, too', 'A kind note or an offer to help can mean just as much as a wrapped present. Little gestures can be a lovely way to show that you are thinking of the whole family.'],
      ['Make it personal', 'Choose a color, print, or theme that reminds you of the family. A simple message about why you chose the gift can make it even more memorable.']
    ]
  }
];

export const brands = [
  'KIDOBOX',
  'Pampers',
  'Huggies',
  'Johnson’s',
  'Mee Mee',
  'Philips Avent',
  'Chicco',
  'Babyhug',
  'Fisher-Price'
];

export const money = (n: number | string) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const image = (name: string) => {
  if (!name) return '/assets/hd/hero.webp';
  if (name.startsWith('/') || name.startsWith('http')) return name;
  return `/assets/hd/${name}.webp`;
};
