import { createContext, useContext, useEffect, useReducer } from "react";
import { bookingService, eventService, influencerService, packageService } from "../services/api";

const AppContext = createContext();

const initialState = {
  user: null,

  influencers: [],
  events: [],
  packages: [],
  bookings: [],
  queries: [],

  categories: [
    { id: 1, name: "Birthday Party", description: "Celebrate with style" },
    { id: 2, name: "Engagement", description: "Memorable engagement events" },
    { id: 3, name: "Wedding", description: "Perfect wedding experiences" },
    { id: 4, name: "Corporate Event", description: "Professional influencer bookings" },
    { id: 5, name: "Product Launch", description: "Launch your brand with influencers" },
    { id: 6, name: "Charity Event", description: "Support causes with influencers" },
    { id: 7, name: "Music Concert", description: "Live shows & concerts" },
    { id: 8, name: "Sports Event", description: "Sports influencer appearances" },
  ],

  loading: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_INFLUENCERS":
      return { ...state, influencers: action.payload };

    case "SET_EVENTS":
      return { ...state, events: action.payload };

    case "SET_PACKAGES":
      return { ...state, packages: action.payload };

    case "SET_BOOKINGS":
      return { ...state, bookings: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // LOAD USER FROM LOCAL STORAGE
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(savedUser) });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({ type: "SET_USER", payload: userData });
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "SET_USER", payload: null });
  };

  const setInfluencers = (list) => {
    dispatch({ type: "SET_INFLUENCERS", payload: list });
  };

  // CRUD helpers for Influencers used by Admin pages
  const addInfluencer = async (data) => {
    const created = await influencerService.create(data);
    dispatch({ type: "SET_INFLUENCERS", payload: [created, ...state.influencers] });
    return created;
  };
  const updateInfluencer = async (id, data) => {
    const updated = await influencerService.update(id, data);
    dispatch({ type: "SET_INFLUENCERS", payload: state.influencers.map((i) => (i._id === updated._id ? updated : i)) });
    return updated;
  };
  const deleteInfluencer = async (id) => {
    await influencerService.delete(id);
    dispatch({ type: "SET_INFLUENCERS", payload: state.influencers.filter((i) => i._id !== id) });
  };

  const setEvents = (list) => {
    dispatch({ type: "SET_EVENTS", payload: list });
  };
  const addEvent = async (data) => {
    const created = await eventService.create(data);
    dispatch({ type: "SET_EVENTS", payload: [created, ...state.events] });
    return created;
  };
  const updateEvent = async (id, data) => {
    const updated = await eventService.update(id, data);
    dispatch({ type: "SET_EVENTS", payload: state.events.map((e) => (e._id === updated._id ? updated : e)) });
    return updated;
  };
  const deleteEvent = async (id) => {
    await eventService.delete(id);
    dispatch({ type: "SET_EVENTS", payload: state.events.filter((e) => e._id !== id) });
  };

  const setPackages = (list) => {
    dispatch({ type: "SET_PACKAGES", payload: list });
  };
  const addPackage = async (data) => {
    const created = await packageService.create(data);
    dispatch({ type: "SET_PACKAGES", payload: [created, ...state.packages] });
    return created;
  };
  const updatePackage = async (id, data) => {
    const updated = await packageService.update(id, data);
    dispatch({ type: "SET_PACKAGES", payload: state.packages.map((p) => (p._id === updated._id ? updated : p)) });
    return updated;
  };
  const deletePackage = async (id) => {
    await packageService.delete(id);
    dispatch({ type: "SET_PACKAGES", payload: state.packages.filter((p) => p._id !== id) });
  };

  const updateBookingStatus = async (id, status) => {
    const updated = await bookingService.updateStatus(id, status);
    dispatch({ type: "SET_BOOKINGS", payload: state.bookings.map((b) => (b._id === updated._id ? updated : b)) });
    return updated;
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setInfluencers,
        setEvents,
        addInfluencer,
        updateInfluencer,
        deleteInfluencer,
        addEvent,
        updateEvent,
        deleteEvent,
        setPackages,
        addPackage,
        updatePackage,
        deletePackage,
        updateBookingStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
