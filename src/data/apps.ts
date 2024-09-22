export interface App {
  id: number;
  description: string;
  name: string;
  repo: string;
}

export const apps = [
  {
    id: 1,
    name: 'authy',
    description: 'some attempt at a shared authentication abstraction',
    repo: 'git@github.com:whattheearl/authy.git'
  },
  {
    id: 2,
    name: 'jeddit',
    description: 'like reddit but for me',
    repo: 'git@github.com:whattheearl/jeddit.git'
  },

];
