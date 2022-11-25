import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import faker from "@faker-js/faker";
import * as jwt from "jsonwebtoken";
import { createPayment, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { createHotel } from "../factories/hotels-factory";
import { createRoom } from "../factories/rooms-factory";
import { createTicketType, createTicket } from "../factories/tickets-factory";
import { createEnrollmentWithAddress } from "../factories/enrollments-factory";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

// afterAll(async () => {
//   await cleanDb();
// });

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 403 when user does not have a ticket that includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: false });
      await createTicket(enrollment.id, ticketType.id, "RESERVED");
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 402 when user has an unpaid ticket that includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      await createTicket(enrollment.id, ticketType.id, "RESERVED");
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    describe("when user has payed ticket that includes hotel", () => {
      it("should respond with empty array when there are no hotels", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        await createPayment(ticket.id, ticketType.price);
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.body).toEqual([]);
      });

      it("should respond with status 200 and with existing hotels data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
          },
        ]);
      });
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const hotelId = 1;
    const response = await server.get(`/hotels/${hotelId}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const hotelId = 1;
    const token = faker.lorem.word();
    const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const hotelId = 1;
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 403 when user does not have a ticket that includes hotel", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: false });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 402 when user has an unpaid ticket that includes hotel", async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    describe("when user has payed ticket that includes hotel", () => {
      it("should respond with status 404 when hotel with given hotelId is not found", async () => {
        const hotelId = 1;
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should respond with empty array when there are no rooms for passed hotelId", async () => {
        const hotel = await createHotel();
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
          Rooms: [],
        });
      });

      it("should respond with status 200 and with existing hotel rooms data", async () => {
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
          Rooms: [
            {
              id: room.id,
              name: room.name,
              capacity: room.capacity,
              hotelId: room.hotelId,
              createdAt: room.createdAt.toISOString(),
              updatedAt: room.updatedAt.toISOString(),
            },
          ],
        });
      });
    });
  });
});
