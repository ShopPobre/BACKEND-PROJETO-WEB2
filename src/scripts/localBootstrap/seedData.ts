export type SeedCategory = {
  name: string;
  description?: string | null;
};

export type SeedProduct = {
  name: string;
  description?: string | null;
  price: number;
  categoryName: string;
  images: Array<{
    seedFileName: string; // arquivo em seed-images/
    originalName: string;
  }>;
};

/**
 * Categorias:
 * - Games, Celulares, Papelaria, Computadores, Livros, Placa de Vídeo...
 */
export const seedCategories: SeedCategory[] = [
  { name: "Games", description: "Games e consoles" },
  { name: "Celulares", description: "Celulares e comunicação" },
  { name: "Papelaria", description: "Papelaria e material escolar" },
  { name: "Computadores", description: "Computadores e informática" },
  { name: "Livros", description: "Livros e e-books" },
  { name: "Placa de Vídeo", description: "Placas de vídeo e componentes" },
  { name: "Eletrônicos", description: "Eletrônicos e acessórios" },
  { name: "Casa", description: "Casa e cozinha" },
  { name: "Brinquedos e Jogos", description: "Brinquedos e jogos" },
  { name: "Moda", description: "Moda e acessórios" },
  { name: "Beleza", description: "Beleza e cuidados pessoais" },
  { name: "Mercado", description: "Mercado e alimentos" },
];

const IMAGE_PREFIX = "SEED__";
const IMAGE_EXT = "png";
const IMAGES_PER_PRODUCT = 4;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toSlug(input: string) {
  if (input === "Eletrônicos") {
    return "eletronico";
  }
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildSeedImages(categoryName: string, productName: string) {
  const categorySlug = toSlug(categoryName);
  const productSlug = toSlug(productName);
  const images: SeedProduct["images"] = [];

  for (let i = 1; i <= IMAGES_PER_PRODUCT; i++) {
    const imgCode = `IMG${pad2(i)}`;
    const base = `${IMAGE_PREFIX}${categorySlug}__${productSlug}__${imgCode}.${IMAGE_EXT}`;
    images.push({ seedFileName: base, originalName: base });
  }

  return images;
}

type CatalogItem = { name: string; description: string; price: number };

// Catálogo estático (6 produtos por categoria) com nomes/descrições/preços definidos.
const seedCatalog: Record<string, CatalogItem[]> = {
  Games: [
    { name: "PlayStation 5 Slim (Digital)", description: "Console PlayStation 5 versão digital com SSD ultrarrápido.", price: 3799.9 },
    { name: "Xbox Series S 512GB", description: "Console compacto para jogos em 1440p com acesso ao ecossistema Xbox.", price: 2299.9 },
    { name: "Controle DualSense", description: "Controle sem fio para PS5 com feedback háptico e gatilhos adaptáveis.", price: 399.9 },
    { name: "Headset Gamer HyperX Cloud Stinger", description: "Headset leve com microfone e boa qualidade de áudio para jogos.", price: 229.9 },
    { name: "Jogo: EA Sports FC 24 (PS5)", description: "Jogo de futebol para PlayStation 5.", price: 249.9 },
    { name: "Mousepad Gamer Grande (90x40)", description: "Mousepad estendido para teclado e mouse, base emborrachada.", price: 79.9 },
  ],
  Celulares: [
    { name: "Samsung Galaxy A54 5G 128GB", description: "Smartphone com câmera tripla, tela Super AMOLED e 5G.", price: 1799.9 },
    { name: "Motorola Moto G84 256GB", description: "Smartphone intermediário com boa tela e armazenamento amplo.", price: 1499.9 },
    { name: "iPhone 13 128GB", description: "Apple iPhone 13 com chip A15 Bionic e câmeras avançadas.", price: 3599.9 },
    { name: "Carregador Turbo USB-C 25W", description: "Carregador rápido 25W compatível com dispositivos USB-C.", price: 99.9 },
    { name: "Cabo USB-C 1m (Reforçado)", description: "Cabo USB-C reforçado para carga e dados.", price: 39.9 },
    { name: "Fone Bluetooth In-Ear", description: "Fone sem fio compacto com estojo carregador.", price: 129.9 },
  ],
  Papelaria: [
    { name: "Caderno Universitário 200 folhas", description: "Caderno capa dura, 10 matérias, 200 folhas.", price: 29.9 },
    { name: "Caneta Esferográfica (kit 10 un)", description: "Kit com 10 canetas esferográficas para uso diário.", price: 19.9 },
    { name: "Lápis Preto HB (kit 12 un)", description: "Kit com 12 lápis HB para escrita e desenho.", price: 14.9 },
    { name: "Borracha Branca (kit 3 un)", description: "Borracha macia para grafite, kit com 3 unidades.", price: 9.9 },
    { name: "Mochila Escolar 20L", description: "Mochila leve com compartimento principal e bolsos frontais.", price: 89.9 },
    { name: "Estojo Escolar Duplo", description: "Estojo com 2 compartimentos para organizar materiais.", price: 24.9 },
  ],
  Computadores: [
    { name: "Notebook Lenovo IdeaPad 3 (i5/8GB/256GB)", description: "Notebook para estudos e trabalho com SSD e processador Intel i5.", price: 2799.9 },
    { name: "Monitor 24\" Full HD 75Hz", description: "Monitor 24 polegadas, resolução Full HD, taxa 75Hz.", price: 599.9 },
    { name: "Teclado Mecânico ABNT2 (Switch Brown)", description: "Teclado mecânico com layout ABNT2 e switches táteis.", price: 249.9 },
    { name: "Mouse sem fio 1600 DPI", description: "Mouse sem fio ergonômico para uso diário.", price: 59.9 },
    { name: "SSD SATA 480GB", description: "SSD SATA para melhorar desempenho de PCs e notebooks.", price: 199.9 },
    { name: "Pendrive 64GB USB 3.0", description: "Pendrive 64GB com USB 3.0 para transferências rápidas.", price: 49.9 },
  ],
  Livros: [
    { name: "Clean Code (Robert C. Martin)", description: "Boas práticas e princípios para escrever código limpo.", price: 119.9 },
    { name: "Entendendo Algoritmos", description: "Introdução visual e prática a algoritmos e estruturas.", price: 89.9 },
    { name: "Estruturas de Dados e Algoritmos com JavaScript", description: "Guia prático de estruturas de dados e algoritmos em JS.", price: 99.9 },
    { name: "O Programador Pragmático", description: "Clássico sobre mentalidade e práticas de engenharia de software.", price: 129.9 },
    { name: "Refatoração (Martin Fowler)", description: "Técnicas para melhorar o design de código existente.", price: 159.9 },
    { name: "Padrões de Projeto (GoF)", description: "Catálogo de patterns clássicos para projetos OO.", price: 179.9 },
  ],
  "Placa de Vídeo": [
    { name: "NVIDIA GeForce RTX 4060 8GB", description: "GPU para jogos em 1080p/1440p com suporte a DLSS.", price: 1999.9 },
    { name: "AMD Radeon RX 7600 8GB", description: "GPU intermediária para jogos em 1080p com ótimo custo-benefício.", price: 1799.9 },
    { name: "Fonte 650W 80 Plus Bronze", description: "Fonte de alimentação 650W com certificação 80 Plus Bronze.", price: 289.9 },
    { name: "Memória RAM 16GB DDR4 3200MHz", description: "Módulo de memória DDR4 16GB 3200MHz.", price: 219.9 },
    { name: "Pasta Térmica 4g", description: "Pasta térmica para melhorar a transferência de calor.", price: 29.9 },
    { name: "Cooler 120mm (kit 3)", description: "Kit de 3 coolers 120mm para ventilação do gabinete.", price: 99.9 },
  ],
  Eletrônicos: [
    { name: "Smart TV 50\" 4K", description: "TV 50 polegadas 4K com apps e conectividade.", price: 2199.9 },
    { name: "Caixa de Som Bluetooth", description: "Caixa de som portátil com Bluetooth e bateria recarregável.", price: 199.9 },
    { name: "Fone de Ouvido Over-Ear", description: "Fone confortável com bom isolamento acústico.", price: 149.9 },
    { name: "Webcam Full HD", description: "Webcam 1080p para aulas, reuniões e lives.", price: 129.9 },
    { name: "Roteador Wi‑Fi Dual Band", description: "Roteador com 2.4GHz/5GHz para melhor cobertura.", price: 179.9 },
    { name: "Filtro de Linha 6 tomadas", description: "Filtro de linha com proteção e 6 tomadas.", price: 59.9 },
  ],
  Casa: [
    { name: "Air Fryer 4L", description: "Fritadeira sem óleo 4 litros, prática para o dia a dia.", price: 349.9 },
    { name: "Jogo de Panelas (5 peças)", description: "Conjunto de panelas antiaderente com 5 peças.", price: 299.9 },
    { name: "Liquidificador 900W", description: "Liquidificador potente para sucos e vitaminas.", price: 169.9 },
    { name: "Cafeteira Elétrica 30 xícaras", description: "Cafeteira para uso doméstico, jarra de vidro.", price: 129.9 },
    { name: "Jogo de Cama Casal", description: "Jogo de cama casal com lençol e fronhas.", price: 119.9 },
    { name: "Organizador de Gaveta (kit 6)", description: "Kit de organizadores para gavetas e armários.", price: 49.9 },
  ],
  "Brinquedos e Jogos": [
    { name: "Quebra-cabeça 1000 peças", description: "Quebra-cabeça 1000 peças para lazer e desafio.", price: 69.9 },
    { name: "Jogo de Tabuleiro (Família)", description: "Jogo de tabuleiro para 2 a 6 jogadores.", price: 89.9 },
    { name: "Lego Compatível (Kit 300 peças)", description: "Kit de blocos de montar com 300 peças.", price: 79.9 },
    { name: "Boneca Clássica", description: "Boneca articulada para crianças.", price: 59.9 },
    { name: "Carrinho de Controle Remoto", description: "Carrinho com controle remoto e bateria recarregável.", price: 99.9 },
    { name: "Baralho (plástico)", description: "Baralho resistente em plástico para jogos.", price: 19.9 },
  ],
  Moda: [
    { name: "Camiseta Básica Algodão", description: "Camiseta básica 100% algodão, confortável.", price: 39.9 },
    { name: "Calça Jeans Slim", description: "Calça jeans slim para uso casual.", price: 129.9 },
    { name: "Tênis Casual", description: "Tênis casual leve para o dia a dia.", price: 159.9 },
    { name: "Moletom Canguru", description: "Moletom com capuz e bolso canguru.", price: 119.9 },
    { name: "Relógio Digital", description: "Relógio digital resistente para uso diário.", price: 79.9 },
    { name: "Boné Aba Curva", description: "Boné ajustável com aba curva.", price: 49.9 },
  ],
  Beleza: [
    { name: "Shampoo 400ml", description: "Shampoo para limpeza e cuidado diário.", price: 24.9 },
    { name: "Condicionador 400ml", description: "Condicionador para hidratação e maciez.", price: 24.9 },
    { name: "Hidratante Corporal 200ml", description: "Hidratante corporal para pele macia.", price: 29.9 },
    { name: "Protetor Solar FPS 50", description: "Protetor solar FPS 50 para uso diário.", price: 49.9 },
    { name: "Kit Pincéis de Maquiagem (10)", description: "Kit com 10 pincéis para maquiagem.", price: 39.9 },
    { name: "Desodorante Aerosol", description: "Desodorante aerosol para proteção diária.", price: 19.9 },
  ],
  Mercado: [
    { name: "Arroz 5kg", description: "Pacote de arroz 5kg.", price: 29.9 },
    { name: "Feijão 1kg", description: "Feijão 1kg para refeições do dia a dia.", price: 9.9 },
    { name: "Café 500g", description: "Café torrado e moído 500g.", price: 19.9 },
    { name: "Açúcar 1kg", description: "Açúcar refinado 1kg.", price: 6.9 },
    { name: "Óleo de Soja 900ml", description: "Óleo de soja 900ml.", price: 8.9 },
    { name: "Macarrão 500g", description: "Macarrão 500g para preparo rápido.", price: 5.9 },
  ],
};

export const seedProducts: SeedProduct[] = seedCategories.flatMap((c) => {
  const items = seedCatalog[c.name];
  if (!items || items.length < 6) {
    throw new Error(`seedCatalog: esperado 6+ produtos para a categoria "${c.name}"`);
  }
  return items.slice(0, 6).map((item) => ({
    name: item.name,
    description: item.description,
    price: item.price,
    categoryName: c.name,
    images: buildSeedImages(c.name, item.name),
  }));
});

