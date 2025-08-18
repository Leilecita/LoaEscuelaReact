export type RootStackParamList = {
    Authentication: undefined;
    MainApp: undefined;
    Students: undefined;
    Asistencias: undefined; 
    CreateStudent: undefined;
    CargarPago : undefined;
    ListaDePagos: undefined;
    
    ListaDeAlumnos: { category: string; subcategoria: string; shouldReload?: boolean;  modo?: 'lista' | 'asistencias' | 'cargarPago'; planilla_id?: number | null }
    StudentListScreen: undefined; // <-- no recibe params
    PaymentStudentList: { category: string; subcategoria: string; date: string }; 

    InformationStudent: {  studentId: number;
      firstName: string;
      lastName: string; }; 
    //PagosYClases: { studentId: number };

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
