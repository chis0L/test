import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    employees: async () => prisma.employee.findMany(),
    employee: async (_: any, { id }: { id: string }) => prisma.employee.findUnique({ where: { id } }),
    employeeSchedule: async (_: any, { employeeId, year, month }: { employeeId: string, year: number, month: number }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      return prisma.employeeSchedule.findMany({
        where: {
          employeeId,
          date: { gte: start, lte: end },
        },
      });
    },
    employeeStats: async () => {
      // Заглушка, можно реализовать позже
      return {
        total: await prisma.employee.count(),
        byStatus: [],
        avgAge: null,
        avgSalary: null,
        hireByMonth: [],
        topPositions: [],
        attendance: [],
      };
    },
  },
  Mutation: {
    createEmployee: async (_: any, { input }: any) => {
      const employee = await prisma.employee.create({ data: input });
      return { employee };
    },
    updateEmployee: async (_: any, { id, input }: any) => {
      const employee = await prisma.employee.update({ where: { id }, data: input });
      return { employee };
    },
    deleteEmployee: async (_: any, { id }: any) => {
      await prisma.employee.delete({ where: { id } });
      return true;
    },
    updateEmployeeSchedule: async (_: any, { input }: any) => {
      const { employeeId, date, ...rest } = input;
      await prisma.employeeSchedule.upsert({
        where: { employeeId_date: { employeeId, date } },
        update: rest,
        create: { employeeId, date, ...rest },
      });
      return true;
    },
  },
  Employee: {
    scheduleRecords: (parent: any) => prisma.employeeSchedule.findMany({ where: { employeeId: parent.id } }),
  },
  Organization: {
    employees: (parent: any) => prisma.employee.findMany({ where: { organizationId: parent.id } }),
  },
}; 