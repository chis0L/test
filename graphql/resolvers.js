const employees = [];

const resolvers = {
  Query: {
    employees: async () => employees,
  },
  Mutation: {
    createEmployee: async (_, { input }) => {
      // Проверка обязательных полей
      if (
        !input.firstName ||
        !input.lastName ||
        !input.position ||
        !input.phone ||
        !input.hireDate ||
        !input.organizationId
      ) {
        throw new Error("Обязательные поля не заполнены");
      }
      const now = new Date().toISOString();
      const newEmployee = {
        id: String(Date.now()),
        firstName: input.firstName,
        lastName: input.lastName,
        middleName: input.middleName ?? undefined,
        birthDate: input.birthDate
          ? new Date(input.birthDate).toISOString()
          : undefined,
        avatar: input.avatar ?? undefined,
        position: input.position,
        department: input.department ?? undefined,
        hireDate: input.hireDate
          ? new Date(input.hireDate).toISOString()
          : undefined,
        salary: input.salary ?? undefined,
        status: input.status || "ACTIVE",
        phone: input.phone,
        email: input.email ?? undefined,
        telegram: input.telegram ?? undefined,
        whatsapp: input.whatsapp ?? undefined,
        emergencyContact: input.emergencyContact ?? undefined,
        emergencyPhone: input.emergencyPhone ?? undefined,
        createdAt: now,
        updatedAt: now,
        scheduleRecords: [],
        organizationId: input.organizationId,
        passportPhoto: input.passportPhoto ?? undefined,
        passportSeries: input.passportSeries ?? undefined,
        passportNumber: input.passportNumber ?? undefined,
        passportIssued: input.passportIssued ?? undefined,
        passportDate: input.passportDate
          ? new Date(input.passportDate).toISOString()
          : undefined,
      };
      console.log("Создан сотрудник:", newEmployee);
      employees.push(newEmployee);
      return { employee: newEmployee };
    },
    updateEmployee: async (_, { id, input }) => {
      const idx = employees.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error("Сотрудник не найден");
      // Обновляем только переданные поля
      employees[idx] = {
        ...employees[idx],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      return { employee: employees[idx] };
    },
    deleteEmployee: async (_, { id }) => {
      try {
        const idx = employees.findIndex((e) => e.id === id);
        if (idx === -1) return false;
        employees.splice(idx, 1);
        return true;
      } catch {
        return false;
      }
      return false;
    },
  },
};

module.exports = { resolvers };
