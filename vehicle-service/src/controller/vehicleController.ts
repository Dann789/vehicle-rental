import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleCar,  
  getVehicleBus,
  getVehicleElf,
  getVehicleMotor,
} from '../services/vehicleService';

export const getVehicles = async (): Promise<Response> => {
  const vehicles = await getAllVehicles();
  return Response.json(vehicles);
};

export const getVehicle = async (id: number): Promise<Response> => {
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return new Response(JSON.stringify({ message: 'Vehicle not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(vehicle), {
    headers: { 'Content-Type': 'application/json' },
  });
};


export const getCarCount = async (): Promise<Response> => {
  try {
    const countCar = await getVehicleCar();
    return Response.json({ countCar });
  } catch (error) {
    console.error('Error in getCarCount:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};


export const getBusCount = async (): Promise<Response> => {
  const countBus  = await getVehicleBus();
  return Response.json({ countBus });
};

export const getElfCount = async (): Promise<Response> => {
  const countElf = await getVehicleElf();
  return Response.json({ countElf });
};

export const getMotorCount = async (): Promise<Response> => {
  const countMotor = await getVehicleMotor();
  return Response.json({ countMotor });
};

export const createVehicleHandler = async (body: any): Promise<Response> => {
  const vehicle = await createVehicle(body);
  return Response.json(vehicle);
};

export const updateVehicleHandler = async (id: number, body: any): Promise<Response> => {
  const vehicle = await updateVehicle(id, body);
  return Response.json(vehicle);
};

export const deleteVehicleHandler = async (id: number): Promise<Response> => {
  const result = await deleteVehicle(id);
  return Response.json(result);
};
