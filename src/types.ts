export type RootStackParamList = {
    Authentication: undefined;
    MainApp: undefined;
    Students: undefined;
    Asistencias: undefined; 
    CreateStudent: undefined;
    
    ListaDeAlumnos: { category: string; subcategoria: string; shouldReload?: boolean;  modo?: 'lista' | 'asistencias'; planilla_id?: number | null }
    StudentListScreen: undefined; // <-- no recibe params

  };
  
  export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
  };
  
  export type MainAppTabParamList = {
    Home: undefined;
    Porfile: undefined;
  };

  export type Subcategoria = 'adultos' | 'mini' | 'kids' | 'highschool' | 'intermedios' | 'Todo' ;
  export type Category = 'Escuela' | 'Colonia' | 'Highschool' | 'Todo';
