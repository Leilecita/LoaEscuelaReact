import { useState, useEffect } from "react";
import dayjs from "dayjs";
import api from "../services/axiosClient"; // <-- esto es clave

export type DayJob = {
  id: number;
  name: string;
  category: string;
  created: string;
};

export const useJobs = () => {
  const [jobs, setJobs] = useState<DayJob[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/day_jobs.php", { params: { method: "getAll" } });
      if (Array.isArray(data.data)) setJobs(data.data);
      else setJobs([]);
    } catch (error) {
      console.error("Error al cargar trabajos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedJobs = async (workerId: number, date: Date) => {
   try {
     const formattedDate = dayjs(date).format("YYYY-MM-DD");
     const { data } = await api.get("/worker_jobs.php", {
       params: { method: "getByWorkerAndDate", worker_id: workerId, date: formattedDate },
     });
 
     if (data.result === "success" && Array.isArray(data.data)) {
       const jobs = data.data.map((id: any) => Number(id));
       setSelectedJobs(jobs);
       return jobs; // 👈 devolvemos los trabajos
     } else {
       setSelectedJobs([]);
       return []; // 👈 devolvemos un array vacío
     }
   } catch (error) {
     console.error("Error al cargar trabajos previos", error);
     return [];
   }
 };
 
  
 /* const fetchSelectedJobs = async (workerId: number, date: Date) => {
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const { data } = await api.get("/worker_jobs.php", {
        params: { method: "getByWorkerAndDate", worker_id: workerId, date: formattedDate },
      });

      if (data.result === "success" && Array.isArray(data.data)) {
        setSelectedJobs(data.data.map((id: any) => Number(id)));
      } else {
        setSelectedJobs([]);
      }
    } catch (error) {
      console.error("Error al cargar trabajos previos", error);
    }
  }; */
  

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, selectedJobs, setSelectedJobs, fetchSelectedJobs, fetchJobs };
};
