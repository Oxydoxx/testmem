import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FamilyMember {
  id: string;
  name: string;
  birthYear: string;
  deathYear?: string;
  birthDate?: string;
  deathDate?: string;
  relation: string;
  avatar: string;
  bio?: string;
  profession?: string;
  hobbies?: string[];
  places?: string[];
  isDeceased: boolean;
  candlesLit?: number;
  timeline?: { year: string; event: string }[];
  privacy: Record<string, boolean>;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  content: string;
  photo?: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface TreeConnection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

export interface TreeBlock {
  id: string;
  memberId: string;
  x: number;
  y: number;
}

export interface Capsule {
  id: string;
  title: string;
  creatorId: string;
  unlockDate: string;
  description: string;
}

export interface WallItem {
  id: string;
  type: 'photo' | 'quote' | 'video';
  authorId: string;
  content?: string;
  mediaUrl?: string;
  date: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  progress: number;
  total: number;
  locked: boolean;
  color: string;
}

interface AppState {
  hasSeenIntro: boolean;
  setHasSeenIntro: (val: boolean) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  
  currentUser: FamilyMember | null;
  setCurrentUser: (user: FamilyMember) => void;
  
  family: Record<string, FamilyMember>;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, data: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  lightCandle: (id: string) => void;
  
  stories: Story[];
  addStory: (story: Story) => void;
  likeStory: (id: string) => void;
  
  treeBlocks: TreeBlock[];
  treeConnections: TreeConnection[];
  updateBlockPosition: (id: string, x: number, y: number) => void;
  addTreeBlock: (block: TreeBlock) => void;
  deleteTreeBlock: (id: string) => void;
  addConnection: (connection: TreeConnection) => void;
  updateConnection: (id: string, data: Partial<TreeConnection>) => void;
  deleteConnection: (id: string) => void;
  
  treeBackground: string;
  setTreeBackground: (bg: string) => void;

  capsules: Capsule[];
  addCapsule: (capsule: Capsule) => void;
  wallItems: WallItem[];
  addWallItem: (item: WallItem) => void;
  achievements: Achievement[];
}

export const initialFamily: Record<string, FamilyMember> = {
  '1': {
    id: '1',
    name: 'Анна Иванова',
    birthYear: '1985',
    birthDate: '14.03.1985',
    relation: 'Я',
    avatar: '/images/anna.png',
    bio: 'Архитектор, мама двоих детей. Увлекаюсь историей нашей семьи и собираю архивные фотографии.',
    profession: 'Главный архитектор в "СтройПроект"',
    hobbies: ['Фотография', 'Садоводство', 'Чтение'],
    places: ['Москва', 'Санкт-Петербург'],
    isDeceased: false,
    privacy: { bio: true, profession: true, hobbies: true, places: true, gallery: true, timeline: true },
  },
  '2': {
    id: '2',
    name: 'Иван Иванович',
    birthYear: '1932',
    birthDate: '22.06.1932',
    deathYear: '2018',
    deathDate: '14.11.2018',
    relation: 'Дедушка',
    avatar: '/images/ivan.png',
    bio: 'Ветеран труда, инженер-мостостроитель. Человек с огромным сердцем и золотыми руками. Построил более 10 мостов по всей стране.',
    profession: 'Инженер-мостостроитель',
    hobbies: ['Шахматы', 'Рыбалка', 'Плотницкое дело'],
    places: ['Новосибирск', 'Екатеринбург', 'Москва'],
    isDeceased: true,
    candlesLit: 142,
    timeline: [
      { year: '1932', event: 'Родился в деревне Сосновка' },
      { year: '1955', event: 'Окончил строительный институт с отличием' },
      { year: '1957', event: 'Женился на Марии' },
      { year: '1970', event: 'Назначен главным инженером проекта' },
      { year: '1995', event: 'Награжден орденом Трудового Красного Знамени' },
      { year: '2018', event: 'Скончался в окружении семьи' },
    ],
    privacy: { bio: true, profession: true, hobbies: true, places: true, gallery: true, timeline: true },
  },
  '3': {
    id: '3',
    name: 'Мария Петровна',
    birthYear: '1935',
    birthDate: '08.03.1935',
    deathYear: '2010',
    deathDate: '20.01.2010',
    relation: 'Бабушка',
    avatar: '/images/maria.png',
    bio: 'Учительница литературы. Привила всем нам любовь к книгам и поэзии.',
    profession: 'Преподаватель русского языка и литературы',
    isDeceased: true,
    candlesLit: 89,
    privacy: { bio: true, profession: true, hobbies: true, places: true, gallery: true, timeline: true },
  },
  '4': {
    id: '4',
    name: 'Елена Ивановна',
    birthYear: '1960',
    birthDate: '05.09.1960',
    relation: 'Мама',
    avatar: '/images/elena.png',
    profession: 'Врач-педиатр',
    isDeceased: false,
    privacy: { bio: true, profession: true, hobbies: true, places: true, gallery: true, timeline: true },
  },
  '5': {
    id: '5',
    name: 'Дмитрий Сергеевич',
    birthYear: '1958',
    birthDate: '17.11.1958',
    relation: 'Папа',
    avatar: '/images/dmitry.png',
    profession: 'Профессор физики',
    isDeceased: false,
    privacy: { bio: true, profession: true, hobbies: true, places: true, gallery: true, timeline: true },
  }
};

const initialStories: Story[] = [
  {
    id: 's1',
    authorId: '4',
    authorName: 'Елена Ивановна',
    authorAvatar: '/images/elena.png',
    date: '12 марта 2024',
    content: 'Нашла старые письма дедушки Ивана с его первой стройки на БАМе. Сколько в них энтузиазма и веры в будущее! Обязательно отсканирую и добавлю в галерею.',
    likes: 5,
    comments: 2,
    tags: ['Воспоминания', 'Документы'],
  },
  {
    id: 's2',
    authorId: '1',
    authorName: 'Анна Иванова',
    authorAvatar: '/images/anna.png',
    date: '5 февраля 2024',
    content: 'Сегодня был бы день рождения бабушки Маши. Испекли её фирменный яблочный пирог. Дети в восторге.',
    likes: 8,
    comments: 4,
    tags: ['Памятные даты', 'Традиции'],
  }
];

const initialBlocks: TreeBlock[] = [
  { id: 'b2', memberId: '2', x: 200, y: 100 },
  { id: 'b3', memberId: '3', x: 450, y: 100 },
  { id: 'b4', memberId: '4', x: 325, y: 280 },
  { id: 'b5', memberId: '5', x: 80, y: 280 },
  { id: 'b1', memberId: '1', x: 200, y: 460 },
];

const initialConnections: TreeConnection[] = [
  { id: 'c1', fromId: 'b2', toId: 'b3', label: 'Супруги' },
  { id: 'c2', fromId: 'b2', toId: 'b4', label: 'Родитель' },
  { id: 'c3', fromId: 'b3', toId: 'b4', label: 'Родитель' },
  { id: 'c4', fromId: 'b4', toId: 'b1', label: 'Родитель' },
  { id: 'c5', fromId: 'b5', toId: 'b1', label: 'Родитель' },
  { id: 'c6', fromId: 'b5', toId: 'b4', label: 'Супруги' },
];

const initialAchievements: Achievement[] = [
  { id: 'a1', title: 'Хранитель историй', icon: 'BookOpen', progress: 12, total: 20, locked: false, color: 'text-orange-500 bg-orange-100' },
  { id: 'a2', title: 'Корни глубоки', icon: 'Trees', progress: 5, total: 5, locked: false, color: 'text-green-500 bg-green-100' },
  { id: 'a3', title: 'Первое древо', icon: 'Network', progress: 1, total: 1, locked: false, color: 'text-blue-500 bg-blue-100' },
  { id: 'a4', title: 'Капсула времени', icon: 'Lock', progress: 0, total: 1, locked: true, color: 'text-gray-400 bg-gray-100' },
];

const initialCapsules: Capsule[] = [
  { id: 'cap1', title: 'Послание внукам', creatorId: '1', unlockDate: '2045-03-15', description: 'Семейные ценности и пожелания будущим поколениям.' }
];

const initialWallItems: WallItem[] = [
  { id: 'w1', type: 'photo', authorId: '1', mediaUrl: '/images/intro1.png', date: '10 мая 2024', tags: ['Фото'] },
  { id: 'w2', type: 'quote', authorId: '4', content: '«Главное — это семья и поддержка друг друга в трудные времена»', date: '12 мая 2024', tags: ['Цитаты'] },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenIntro: false,
      setHasSeenIntro: (val) => set({ hasSeenIntro: val }),
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
      
      currentUser: initialFamily['1'],
      setCurrentUser: (user) => set({ currentUser: user }),
      
      family: initialFamily,
      addFamilyMember: (member) => set((state) => ({ 
        family: { ...state.family, [member.id]: member } 
      })),
      updateFamilyMember: (id, data) => set((state) => ({
        family: { ...state.family, [id]: { ...state.family[id], ...data } },
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } : state.currentUser,
      })),
      deleteFamilyMember: (id) => set((state) => {
        const newFamily = { ...state.family };
        delete newFamily[id];
        return {
          family: newFamily,
          treeBlocks: state.treeBlocks.filter(b => b.memberId !== id),
        };
      }),
      lightCandle: (id) => set((state) => {
        const member = state.family[id];
        if (!member || !member.isDeceased) return state;
        return {
          family: {
            ...state.family,
            [id]: { ...member, candlesLit: (member.candlesLit || 0) + 1 }
          }
        };
      }),
      
      stories: initialStories,
      addStory: (story) => set((state) => ({ stories: [story, ...state.stories] })),
      likeStory: (id) => set((state) => ({
        stories: state.stories.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s)
      })),
      
      treeBlocks: initialBlocks,
      treeConnections: initialConnections,
      updateBlockPosition: (id, x, y) => set((state) => ({
        treeBlocks: state.treeBlocks.map(b => b.id === id ? { ...b, x, y } : b)
      })),
      addTreeBlock: (block) => set((state) => ({ treeBlocks: [...state.treeBlocks, block] })),
      deleteTreeBlock: (id) => set((state) => ({
        treeBlocks: state.treeBlocks.filter(b => b.id !== id),
        treeConnections: state.treeConnections.filter(c => c.fromId !== id && c.toId !== id),
      })),
      addConnection: (connection) => set((state) => ({ treeConnections: [...state.treeConnections, connection] })),
      updateConnection: (id, data) => set((state) => ({
        treeConnections: state.treeConnections.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteConnection: (id) => set((state) => ({
        treeConnections: state.treeConnections.filter(c => c.id !== id)
      })),
      
      treeBackground: 'Пергамент',
      setTreeBackground: (bg) => set({ treeBackground: bg }),

      capsules: initialCapsules,
      addCapsule: (capsule) => set((state) => ({ capsules: [...state.capsules, capsule] })),
      wallItems: initialWallItems,
      addWallItem: (item) => set((state) => ({ wallItems: [...state.wallItems, item] })),
      achievements: initialAchievements,
    }),
    {
      name: 'pamyat-storage',
    }
  )
);
