--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE ar_internal_metadata OWNER TO postgres;

--
-- Name: billing_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE billing_addresses (
    id integer NOT NULL,
    user_id integer,
    line1 character varying,
    line2 character varying,
    city character varying,
    state character varying,
    zip character varying,
    country character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE billing_addresses OWNER TO postgres;

--
-- Name: billing_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE billing_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE billing_addresses_id_seq OWNER TO postgres;

--
-- Name: billing_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE billing_addresses_id_seq OWNED BY billing_addresses.id;


--
-- Name: boat_amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE boat_amenities (
    id integer NOT NULL,
    name character varying,
    icon character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE boat_amenities OWNER TO postgres;

--
-- Name: boat_amenities_boats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE boat_amenities_boats (
    boat_id integer NOT NULL,
    boat_amenity_id integer NOT NULL
);


ALTER TABLE boat_amenities_boats OWNER TO postgres;

--
-- Name: boat_amenities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE boat_amenities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE boat_amenities_id_seq OWNER TO postgres;

--
-- Name: boat_amenities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE boat_amenities_id_seq OWNED BY boat_amenities.id;


--
-- Name: boat_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE boat_classes (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    price_season_peak double precision,
    color_hex character varying,
    price_season_peak_hh double precision,
    price_season double precision,
    price_season_hh double precision
);


ALTER TABLE boat_classes OWNER TO postgres;

--
-- Name: boat_classes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE boat_classes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE boat_classes_id_seq OWNER TO postgres;

--
-- Name: boat_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE boat_classes_id_seq OWNED BY boat_classes.id;


--
-- Name: boat_classes_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE boat_classes_users (
    boat_class_id integer,
    user_id integer
);


ALTER TABLE boat_classes_users OWNER TO postgres;

--
-- Name: boat_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE boat_images (
    id integer NOT NULL,
    image_url character varying,
    is_primary boolean,
    boat_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE boat_images OWNER TO postgres;

--
-- Name: boat_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE boat_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE boat_images_id_seq OWNER TO postgres;

--
-- Name: boat_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE boat_images_id_seq OWNED BY boat_images.id;


--
-- Name: boats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE boats (
    id integer NOT NULL,
    name character varying,
    description character varying,
    year integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    status integer DEFAULT 0,
    boat_class_id integer,
    length integer,
    engine character varying,
    engine_hours integer,
    seating integer,
    bathroom integer,
    capacity integer,
    identifier character varying,
    fuel_consumption character varying,
    cruising_speed character varying,
    us_coast_guard_capacity character varying
);


ALTER TABLE boats OWNER TO postgres;

--
-- Name: boats_booking_checklist_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE boats_booking_checklist_categories (
    boat_id integer,
    booking_checklist_category_id integer
);


ALTER TABLE boats_booking_checklist_categories OWNER TO postgres;

--
-- Name: boats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE boats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE boats_id_seq OWNER TO postgres;

--
-- Name: boats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE boats_id_seq OWNED BY boats.id;


--
-- Name: booking_checklist_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE booking_checklist_categories (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE booking_checklist_categories OWNER TO postgres;

--
-- Name: booking_checklist_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE booking_checklist_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE booking_checklist_categories_id_seq OWNER TO postgres;

--
-- Name: booking_checklist_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE booking_checklist_categories_id_seq OWNED BY booking_checklist_categories.id;


--
-- Name: booking_checklist_line_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE booking_checklist_line_items (
    id integer NOT NULL,
    name character varying,
    category_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE booking_checklist_line_items OWNER TO postgres;

--
-- Name: booking_checklist_line_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE booking_checklist_line_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE booking_checklist_line_items_id_seq OWNER TO postgres;

--
-- Name: booking_checklist_line_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE booking_checklist_line_items_id_seq OWNED BY booking_checklist_line_items.id;


--
-- Name: booking_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE booking_images (
    id integer NOT NULL,
    photo_type integer DEFAULT 0,
    image character varying,
    booking_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE booking_images OWNER TO postgres;

--
-- Name: booking_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE booking_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE booking_images_id_seq OWNER TO postgres;

--
-- Name: booking_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE booking_images_id_seq OWNED BY booking_images.id;


--
-- Name: booking_line_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE booking_line_items (
    id integer NOT NULL,
    booking_id integer,
    booking_checklist_line_item_id integer,
    value integer,
    image character varying
);


ALTER TABLE booking_line_items OWNER TO postgres;

--
-- Name: booking_line_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE booking_line_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE booking_line_items_id_seq OWNER TO postgres;

--
-- Name: booking_line_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE booking_line_items_id_seq OWNED BY booking_line_items.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE bookings (
    id integer NOT NULL,
    user_id integer,
    boat_class_id integer,
    boat_id integer,
    start_date date,
    end_date date,
    user_notes character varying,
    status integer DEFAULT 0,
    amount double precision,
    assigned_staff_id integer,
    activated_staff_id integer,
    completed_staff_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    booking_type integer DEFAULT 0,
    start_booking_at timestamp without time zone,
    complete_notes character varying
);


ALTER TABLE bookings OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bookings_id_seq OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE bookings_id_seq OWNED BY bookings.id;


--
-- Name: charges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE charges (
    id integer NOT NULL,
    stripe_charge_id character varying,
    booking_id integer,
    description character varying,
    amount double precision,
    status integer DEFAULT 0,
    charge_type integer DEFAULT 0,
    staff_id integer,
    refund_amount double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    stripe_source_id character varying,
    source integer DEFAULT 0,
    user_id integer,
    ref_charge_id integer
);


ALTER TABLE charges OWNER TO postgres;

--
-- Name: charges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE charges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE charges_id_seq OWNER TO postgres;

--
-- Name: charges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE charges_id_seq OWNED BY charges.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE groups (
    id integer NOT NULL,
    membership_type integer DEFAULT 0,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE groups OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE groups_id_seq OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE groups_id_seq OWNED BY groups.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE roles (
    id integer NOT NULL,
    name character varying,
    resource_type character varying,
    resource_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE schema_migrations OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE settings (
    id integer NOT NULL,
    var character varying NOT NULL,
    value text,
    thing_id integer,
    thing_type character varying(30),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE settings OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE settings_id_seq OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE settings_id_seq OWNED BY settings.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE transactions (
    id integer NOT NULL,
    booking_id integer,
    staff_id integer,
    amount double precision,
    description character varying,
    in_out integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    status integer DEFAULT 0,
    charge_id integer,
    source integer DEFAULT 0,
    card_last4 character varying,
    balance double precision
);


ALTER TABLE transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE transactions_id_seq OWNED BY transactions.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE user_profiles (
    id integer NOT NULL,
    wa_state_marine_photo character varying,
    wa_state_marine_field character varying,
    driver_license_photo character varying,
    driver_license_field character varying,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE user_profiles OWNER TO postgres;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_profiles_id_seq OWNER TO postgres;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_profiles_id_seq OWNED BY user_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip inet,
    last_sign_in_ip inet,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    first_name character varying,
    last_name character varying,
    phone character varying,
    fax character varying,
    address character varying,
    stripe_customer_id character varying,
    profile_picture character varying,
    group_id integer,
    balance double precision DEFAULT 0.0,
    is_active boolean DEFAULT true,
    security_deposit_charge_id integer,
    endorsement text
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: users_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users_roles (
    user_id integer,
    role_id integer
);


ALTER TABLE users_roles OWNER TO postgres;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY billing_addresses ALTER COLUMN id SET DEFAULT nextval('billing_addresses_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boat_amenities ALTER COLUMN id SET DEFAULT nextval('boat_amenities_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boat_classes ALTER COLUMN id SET DEFAULT nextval('boat_classes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boat_images ALTER COLUMN id SET DEFAULT nextval('boat_images_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boats ALTER COLUMN id SET DEFAULT nextval('boats_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_checklist_categories ALTER COLUMN id SET DEFAULT nextval('booking_checklist_categories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_checklist_line_items ALTER COLUMN id SET DEFAULT nextval('booking_checklist_line_items_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_images ALTER COLUMN id SET DEFAULT nextval('booking_images_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_line_items ALTER COLUMN id SET DEFAULT nextval('booking_line_items_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY bookings ALTER COLUMN id SET DEFAULT nextval('bookings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY charges ALTER COLUMN id SET DEFAULT nextval('charges_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY groups ALTER COLUMN id SET DEFAULT nextval('groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY settings ALTER COLUMN id SET DEFAULT nextval('settings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions ALTER COLUMN id SET DEFAULT nextval('transactions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_profiles ALTER COLUMN id SET DEFAULT nextval('user_profiles_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	production	2017-01-09 13:25:53.856627	2017-01-09 13:25:53.856627
\.


--
-- Data for Name: billing_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY billing_addresses (id, user_id, line1, line2, city, state, zip, country, created_at, updated_at) FROM stdin;
\.


--
-- Name: billing_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('billing_addresses_id_seq', 1, false);


--
-- Data for Name: boat_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY boat_amenities (id, name, icon, created_at, updated_at) FROM stdin;
3	Sleeps 2-4 persons	IMG_20161104_084633265.jpg	2017-01-09 15:21:03.619994	2017-01-09 15:21:03.619994
4	Marine Head	IMG_20161104_084633265.jpg	2017-01-09 15:22:01.339321	2017-01-09 15:22:01.339321
5	Enclosed shower	IMG_20161104_084633265.jpg	2017-01-09 15:23:15.676984	2017-01-09 15:23:15.676984
6	Swim deck shower	IMG_20161104_084633265.jpg	2017-01-09 15:24:00.470415	2017-01-09 15:24:00.470415
7	Watersports suitable	IMG_20161104_084633265.jpg	2017-01-09 15:24:49.798442	2017-01-09 15:24:49.798442
8	Bow seating	IMG_20161104_084633265.jpg	2017-01-09 15:25:50.346709	2017-01-09 15:25:50.346709
9	Refridgerator	IMG_20161104_084633265.jpg	2017-01-09 15:26:34.797397	2017-01-09 15:26:34.797397
10	Sun shade	IMG_20161104_084633265.jpg	2017-01-09 15:27:41.79936	2017-01-09 15:27:41.79936
11	Twin engine	IMG_20161104_084633265.jpg	2017-01-09 15:28:40.063831	2017-01-09 15:28:40.063831
12	Watersports tower	IMG_20161104_084633265.jpg	2017-01-09 15:29:33.974368	2017-01-09 15:29:33.974368
13	Indoor seating area	IMG_20161104_084633265.jpg	2017-01-09 15:32:23.971839	2017-01-09 15:32:23.971839
14	Galley	IMG_20161104_084633265.jpg	2017-01-09 15:33:00.820918	2017-01-09 15:33:00.820918
15	Stereo	IMG_20161104_084633265.jpg	2017-01-09 15:33:54.514989	2017-01-09 15:33:54.514989
\.


--
-- Data for Name: boat_amenities_boats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY boat_amenities_boats (boat_id, boat_amenity_id) FROM stdin;
26	15
26	12
26	10
26	7
26	8
25	15
25	12
25	10
25	7
24	15
24	10
24	7
24	8
23	15
23	7
22	15
22	12
22	10
22	8
22	7
22	6
21	15
21	7
18	15
18	10
19	15
19	10
19	8
19	7
27	15
27	12
27	7
20	15
20	10
20	8
15	15
15	10
15	8
15	7
14	15
14	8
14	7
14	10
13	15
13	12
13	10
13	7
13	8
12	15
12	10
12	4
12	8
11	15
11	14
11	13
11	10
11	5
11	4
11	3
11	9
6	15
6	10
6	8
6	4
6	9
9	15
9	14
9	13
9	10
9	9
9	6
9	5
9	4
9	3
5	15
5	14
5	13
5	10
5	6
5	4
5	3
5	5
5	9
8	15
8	12
8	8
8	7
3	15
3	14
3	13
3	11
3	10
3	9
3	5
3	4
3	3
7	15
7	10
7	8
7	7
4	15
4	14
4	13
4	10
4	9
4	4
4	5
4	3
2	15
2	14
2	13
2	11
2	10
2	9
2	5
2	4
2	3
\.


--
-- Name: boat_amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('boat_amenities_id_seq', 15, true);


--
-- Data for Name: boat_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY boat_classes (id, name, created_at, updated_at, price_season_peak, color_hex, price_season_peak_hh, price_season, price_season_hh) FROM stdin;
1	Long Range Cruiser	2017-01-09 16:08:09.29976	2017-01-09 16:08:09.29976	400	#673ab7	400	350	\N
2	Express Cruiser over 30'	2017-01-09 16:08:54.914765	2017-01-09 16:09:15.618939	250	#ff5722	140	200	\N
3	Express Cruiser 24' - 27'	2017-01-09 16:11:37.805195	2017-01-09 16:11:37.805195	160	#009688	90	90	\N
4	Luxury Bow Rider	2017-01-09 16:12:18.350391	2017-01-09 16:12:18.350391	190	#2196f3	100	100	\N
6	Small sportboat / trainer	2017-01-09 16:15:17.695712	2017-01-09 16:15:27.00878	95	#ff5722	60	50	\N
7	Large Pontoon boat	2017-01-09 16:16:19.856811	2017-01-09 16:16:19.856811	160	#607d8b	100	90	\N
8	Small Pontoon boat	2017-01-09 16:17:08.904534	2017-01-09 16:17:08.904534	140	#9c27b0	90	75	\N
9	Tournament Boat	2017-01-09 16:18:11.779064	2017-01-09 16:18:11.779064	110	#8bc34a	75	60	\N
5	Sportboat	2017-01-09 16:14:12.413965	2017-01-09 22:25:17.210629	160	#ffc107	100	90	\N
\.


--
-- Name: boat_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('boat_classes_id_seq', 9, true);


--
-- Data for Name: boat_classes_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY boat_classes_users (boat_class_id, user_id) FROM stdin;
\.


--
-- Data for Name: boat_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY boat_images (id, image_url, is_primary, boat_id, created_at, updated_at) FROM stdin;
1	larson310-1__1_.jpg	t	2	2017-01-09 16:59:01.472402	2017-01-09 16:59:01.472402
2	larson310-2.jpg	f	2	2017-01-09 16:59:01.660202	2017-01-09 16:59:01.660202
3	larson310-4.jpg	f	2	2017-01-09 16:59:01.835413	2017-01-09 16:59:01.835413
4	larson310-5.jpg	f	2	2017-01-09 16:59:01.94977	2017-01-09 16:59:01.94977
5	bayliner3818.jpeg	t	3	2017-01-09 17:00:26.634805	2017-01-09 17:00:26.634805
6	maxum2400se-2.jpg	f	4	2017-01-09 17:03:50.236062	2017-01-09 17:03:50.236062
7	maxum2400se-3.jpg	f	4	2017-01-09 17:03:50.423536	2017-01-09 17:03:50.423536
8	maxum2400se-4.jpg	f	4	2017-01-09 17:03:50.515236	2017-01-09 17:03:50.515236
68	M9A5202.jpg	f	18	2017-01-09 17:55:40.010794	2017-01-09 17:55:40.010794
9	maxum2400se-5.jpg	t	4	2017-01-09 17:03:50.575426	2017-01-09 17:04:01.192233
10	maxum2500se-1.jpg	t	5	2017-01-09 17:05:30.695389	2017-01-09 17:05:30.695389
11	maxum2500se-2.jpg	f	5	2017-01-09 17:05:30.796631	2017-01-09 17:05:30.796631
12	maxum2500se-3.jpg	f	5	2017-01-09 17:05:30.896496	2017-01-09 17:05:30.896496
13	maxum2500se-4.jpg	f	5	2017-01-09 17:05:31.062421	2017-01-09 17:05:31.062421
14	maxum2500se-5.jpg	f	5	2017-01-09 17:05:31.118712	2017-01-09 17:05:31.118712
15	sr270int.jpg	f	6	2017-01-09 17:06:55.742222	2017-01-09 17:06:55.742222
16	sr270wheel.jpg	f	6	2017-01-09 17:06:55.843478	2017-01-09 17:06:55.843478
69	M9A5203.jpg	f	18	2017-01-09 17:55:40.113089	2017-01-09 17:55:40.113089
17	searay270slx-1.jpg	t	6	2017-01-09 17:07:25.575367	2017-01-09 17:07:31.230058
18	Four-Winns-230.jpg	t	7	2017-01-09 17:09:54.730967	2017-01-09 17:09:54.730967
19	fw230aft.jpg	f	7	2017-01-09 17:09:54.877076	2017-01-09 17:09:54.877076
20	M9A7314.jpg	f	7	2017-01-09 17:11:30.066243	2017-01-09 17:11:30.066243
21	M9A7316.jpg	f	7	2017-01-09 17:11:30.189863	2017-01-09 17:11:30.189863
22	M9A7319.jpg	f	7	2017-01-09 17:11:30.320129	2017-01-09 17:11:30.320129
23	bayliner175-1.jpg	t	8	2017-01-09 17:14:38.690667	2017-01-09 17:14:38.690667
24	bayliner175-3.jpg	f	8	2017-01-09 17:14:38.809246	2017-01-09 17:14:38.809246
25	regal_1.jpg	t	9	2017-01-09 17:28:31.532276	2017-01-09 17:28:31.532276
26	regal_2.jpg	f	9	2017-01-09 17:28:31.684694	2017-01-09 17:28:31.684694
27	regal_3.jpg	f	9	2017-01-09 17:28:31.765571	2017-01-09 17:28:31.765571
28	regal_4.jpg	f	9	2017-01-09 17:28:31.880423	2017-01-09 17:28:31.880423
29	regal_5.jpg	f	9	2017-01-09 17:28:31.925342	2017-01-09 17:28:31.925342
30	sr260_1.jpg	t	10	2017-01-09 17:30:34.741479	2017-01-09 17:30:34.741479
31	sr260_2.jpg	f	10	2017-01-09 17:30:34.835295	2017-01-09 17:30:34.835295
32	sr260_3.jpg	f	10	2017-01-09 17:30:34.899225	2017-01-09 17:30:34.899225
33	sr260_4.jpg	f	10	2017-01-09 17:30:34.943288	2017-01-09 17:30:34.943288
34	sr260_5.jpg	f	10	2017-01-09 17:30:35.006333	2017-01-09 17:30:35.006333
35	bl265_1.jpg	t	11	2017-01-09 17:32:34.951995	2017-01-09 17:32:34.951995
36	bl265_2.jpg	f	11	2017-01-09 17:32:35.087367	2017-01-09 17:32:35.087367
37	bl265_3.jpg	f	11	2017-01-09 17:32:35.16708	2017-01-09 17:32:35.16708
38	bl265_4.jpg	f	11	2017-01-09 17:32:35.23828	2017-01-09 17:32:35.23828
39	bl265_5.jpg	f	11	2017-01-09 17:32:35.318052	2017-01-09 17:32:35.318052
40	chap256.jpg	t	12	2017-01-09 17:34:19.744573	2017-01-09 17:34:19.744573
41	chap256wheel.jpg	f	12	2017-01-09 17:34:19.88293	2017-01-09 17:34:19.88293
42	chp256int.jpg	f	12	2017-01-09 17:34:20.025161	2017-01-09 17:34:20.025161
43	fw210.jpg	t	13	2017-01-09 17:40:05.017771	2017-01-09 17:40:05.017771
44	M9A5155.jpg	f	13	2017-01-09 17:40:05.201819	2017-01-09 17:40:05.201819
45	M9A5156.jpg	f	13	2017-01-09 17:40:05.262336	2017-01-09 17:40:05.262336
46	M9A5158.jpg	f	13	2017-01-09 17:40:05.42547	2017-01-09 17:40:05.42547
47	M9A5160.jpg	f	13	2017-01-09 17:40:05.55136	2017-01-09 17:40:05.55136
48	M9A7226.jpg	f	14	2017-01-09 17:45:45.756522	2017-01-09 17:45:45.756522
49	M9A7228.jpg	f	14	2017-01-09 17:45:45.884899	2017-01-09 17:45:45.884899
50	M9A7229.jpg	f	14	2017-01-09 17:45:45.990553	2017-01-09 17:45:45.990553
51	M9A7230.jpg	f	14	2017-01-09 17:45:46.092439	2017-01-09 17:45:46.092439
70	M9A5204.jpg	f	18	2017-01-09 17:55:40.160635	2017-01-09 17:55:40.160635
52	M9A7259.jpg	t	14	2017-01-09 17:45:46.191529	2017-01-09 17:45:57.3327
53	M9A7226.jpg	f	15	2017-01-09 17:47:00.091416	2017-01-09 17:47:00.091416
54	M9A7228.jpg	f	15	2017-01-09 17:47:00.331138	2017-01-09 17:47:00.331138
55	M9A7229.jpg	f	15	2017-01-09 17:47:00.420837	2017-01-09 17:47:00.420837
56	M9A7230.jpg	f	15	2017-01-09 17:47:00.467299	2017-01-09 17:47:00.467299
57	M9A7259.jpg	t	15	2017-01-09 17:47:00.557366	2017-01-09 17:47:08.825378
58	M9A7226.jpg	f	16	2017-01-09 17:48:32.880819	2017-01-09 17:48:32.880819
59	M9A7228.jpg	f	16	2017-01-09 17:48:33.044116	2017-01-09 17:48:33.044116
60	M9A7229.jpg	f	16	2017-01-09 17:48:33.126055	2017-01-09 17:48:33.126055
61	M9A7230.jpg	f	16	2017-01-09 17:48:33.274161	2017-01-09 17:48:33.274161
72	UM9A4782.jpg	f	18	2017-01-09 17:55:40.379268	2017-01-09 17:55:40.379268
62	M9A7259.jpg	t	16	2017-01-09 17:48:33.325345	2017-01-09 17:48:41.670587
63	M9A7226.jpg	f	17	2017-01-09 17:49:51.320336	2017-01-09 17:49:51.320336
64	M9A7228.jpg	f	17	2017-01-09 17:49:51.547989	2017-01-09 17:49:51.547989
65	M9A7229.jpg	f	17	2017-01-09 17:49:51.597854	2017-01-09 17:49:51.597854
66	M9A7230.jpg	f	17	2017-01-09 17:49:51.689626	2017-01-09 17:49:51.689626
71	UM9A4768.jpg	t	18	2017-01-09 17:55:40.267382	2017-01-09 17:55:59.827628
67	M9A7259.jpg	t	17	2017-01-09 17:49:51.787023	2017-01-09 17:55:50.137023
73	harris-24.jpg	t	19	2017-01-09 18:34:00.19831	2017-01-09 18:34:00.19831
74	harris160.jpg	t	20	2017-01-09 18:36:49.177533	2017-01-09 18:36:49.177533
75	prostar.png	t	21	2017-01-09 19:02:16.024661	2017-01-09 19:02:16.024661
76	prostar190.jpg	f	21	2017-01-09 19:02:16.2078	2017-01-09 19:02:16.2078
77	x9.jpg	t	22	2017-01-09 19:03:12.216693	2017-01-09 19:03:12.216693
78	x9dash.jpg	f	22	2017-01-09 19:03:12.298687	2017-01-09 19:03:12.298687
79	x9int.jpg	f	22	2017-01-09 19:03:12.390983	2017-01-09 19:03:12.390983
80	x9port.jpg	f	22	2017-01-09 19:03:12.485648	2017-01-09 19:03:12.485648
81	x9wheel.jpg	f	22	2017-01-09 19:03:12.591548	2017-01-09 19:03:12.591548
82	skinautique-190.jpg	t	23	2017-01-09 19:04:11.057155	2017-01-09 19:04:11.057155
83	Bayliner170.jpg	t	24	2017-01-09 19:06:32.549783	2017-01-09 19:06:32.549783
84	searay-190.jpg	t	25	2017-01-09 19:11:55.319274	2017-01-09 19:11:55.319274
85	searay-190.jpg	t	26	2017-01-09 19:13:17.781572	2017-01-09 22:11:47.407642
90	90_190_1.jpeg	f	27	2017-01-09 23:07:21.078541	2017-01-09 23:07:21.078541
89	90_190_1.jpeg	t	27	2017-01-09 23:06:33.718599	2017-01-09 23:07:21.168
\.


--
-- Name: boat_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('boat_images_id_seq', 90, true);


--
-- Data for Name: boats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY boats (id, name, description, year, created_at, updated_at, status, boat_class_id, length, engine, engine_hours, seating, bathroom, capacity, identifier, fuel_consumption, cruising_speed, us_coast_guard_capacity) FROM stdin;
2	Larson 310	Cuddy cruiser, overnight, family fun\r\nForward dinette converts to bunk, aft bunk\r\nMarine galley, full marine head, shower, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 32 knots\r\nFuel capacity: 85g	\N	2017-01-09 16:59:01.467926	2017-01-09 16:59:01.467926	0	2	\N		\N	\N	\N	\N				
3	Bayliner 3818		\N	2017-01-09 17:00:26.630768	2017-01-09 17:00:26.630768	0	1	\N		\N	\N	\N	\N				
4	Maxum 2400se	Cuddy cruiser, overnight, family fun\r\nForward dinette converts to bunk, aft bunk\r\nMarine galley, full marine head, shower\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 6\r\nCruise speed: 27 knots\r\nFuel capacity: 75g	\N	2017-01-09 17:03:50.231866	2017-01-09 17:03:50.231866	0	3	\N		\N	\N	\N	6		75g	27kts	12
12	Chaparral 256	Day cruiser, family fun\r\nHuge deck, marine head room, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 32 knots\r\nFuel capacity: 85g	\N	2017-01-09 17:34:19.740435	2017-01-09 22:30:17.683927	2	4	\N		\N	\N	\N	8		85g	32kts	12
5	Maxum 2500se	Cuddy cruiser, overnight, family fun\r\nForward dinette converts to bunk, aft bunk\r\nMarine galley, full marine head, shower, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 32 knots\r\nFuel capacity: 85g	\N	2017-01-09 17:05:30.691197	2017-01-09 22:29:50.553149	2	3	\N		\N	\N	\N	8		85g	32kts	12
10	Sea Ray 260	Cuddy cruiser, overnight, family fun\r\nForward dinette converts to bunk, aft bunk\r\nMarine galley, full marine head, shower, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 32 knots\r\nFuel capacity: 85g	\N	2017-01-09 17:30:34.737459	2017-01-09 22:54:04.634864	0	3	\N		\N	\N	\N	8		12g/hr	25kts	12
9	Regal 2565	Cuddy cruiser, overnight, family fun\r\nForward dinette converts to bunk, aft bunk\r\nMarine galley, full marine head, shower, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 32 knots\r\nFuel capacity: 85g	\N	2017-01-09 17:28:31.528095	2017-01-09 17:28:31.528095	0	3	\N		\N	\N	\N	8		85g	32kts	12
11	Bayliner 265	Cuddy cruiser, overnight, family fun\r\n\r\nForward dinette converts to bunk, aft bunk\r\nMarine galley, full marine head, shower, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 32 knots\r\nFuel capacity: 85g	\N	2017-01-09 17:32:34.947029	2017-01-09 17:32:34.947029	0	3	\N		\N	\N	\N	8		85g	32kts	12
15	Bayliner 190 "Deck" 2	Watersports, lake lounging, family fun\r\nLots of room, lots of storage\r\nUnder seat cooler\r\nUSCG capacity: 10 people or 1450 pounds\r\nRecommended passengers: 6\r\nCruise speed: 30 knots\r\nFuel capacity: 45g	\N	2017-01-09 17:47:00.087239	2017-01-09 22:31:09.59029	2	5	\N		\N	\N	\N	6		45g	30kts	10
13	Four Winns 210	Watersports, lake lounging, family fun\r\nLots of room, lots of storage\r\nUnder seat cooler\r\nUSCG capacity: 10 people or 1450 pounds\r\nRecommended passengers: 6\r\nCruise speed: 30 knots\r\nFuel capacity: 45g	\N	2017-01-09 17:40:05.013888	2017-01-09 17:43:04.476445	0	5	\N		\N	\N	\N	6			45g	10
20	Harris FloteBote 160		\N	2017-01-09 18:36:49.173174	2017-01-09 22:57:06.956232	0	8	\N		\N	\N	\N	\N		2 gal/hr at cruise		
19	Harris FloteBote 240		\N	2017-01-09 18:34:00.193997	2017-01-09 22:56:26.288363	0	7	\N		\N	\N	\N	\N		2g/hr at cruise		
14	Bayliner 190 "Deck" 1	Watersports, lake lounging, family fun\r\nLots of room, lots of storage\r\nUnder seat cooler\r\nUSCG capacity: 10 people or 1450 pounds\r\nRecommended passengers: 6\r\nCruise speed: 30 knots\r\nFuel capacity: 45g	\N	2017-01-09 17:45:45.752439	2017-01-09 22:31:23.533591	2	5	\N		\N	\N	\N	6			30kts	10
17	Bayliner 190 "Deck" 4	Watersports, lake lounging, family fun\r\nLots of room, lots of storage\r\nUnder seat cooler\r\nUSCG capacity: 10 people or 1450 pounds\r\nRecommended passengers: 6\r\nCruise speed: 30 knots\r\nFuel capacity: 45g	\N	2017-01-09 17:49:51.316337	2017-01-09 22:28:15.595533	2	5	\N		\N	\N	\N	6		45g	30kts	10
7	Four Winns 230	Watersports, lake lounging, family fun\r\nLots of room, lots of storage\r\nUnder seat cooler, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 30 knots\r\nFuel capacity: 75g	\N	2017-01-09 17:09:54.726849	2017-01-09 22:28:59.534377	2	5	\N		\N	\N	\N	8		75g	30kts	12
8	Bayliner 175 Bowrider	Watersports, lake lounging, family fun\r\nLots of room, lots of storage\r\nUSCG capacity: 8 people or 1450 pounds\r\nRecommended passengers: 6\r\nCruise speed: 27 knots\r\nFuel capacity: 30g	\N	2017-01-09 17:14:38.686494	2017-01-09 22:28:39.104282	2	6	\N		\N	\N	\N	6		30g	27kts	8
18	Bayliner 160	Watersports, lake lounging, family fun\r\n\r\nLots of room, lots of storage\r\nUSCG capacity: 8 people or 1450 pounds\r\nRecommended passengers: 6\r\nCruise speed: 27 knots\r\nFuel capacity: 30g	\N	2017-01-09 17:55:40.006605	2017-01-09 22:27:49.968581	2	6	\N		\N	\N	\N	6		30g	27kts	8
16	Bayliner 190 "Deck" 3	Watersports, lake lounging, family fun\r\nLots of room, lots of storage\r\nUnder seat cooler\r\nUSCG capacity: 10 people or 1450 pounds\r\nRecommended passengers: 6\r\nCruise speed: 30 knots\r\nFuel capacity: 45g	\N	2017-01-09 17:48:32.876667	2017-01-09 22:30:53.509033	2	5	\N		\N	\N	\N	6		45g	30kts	10
6	Sea Ray 270 SLX	Day cruiser, family fun\r\nHuge deck, marine head room, deck sink with running water\r\nUSCG capacity: 12 people or 1650 pounds\r\nRecommended passengers: 8\r\nCruise speed: 32 knots\r\nFuel capacity: 85g	\N	2017-01-09 17:06:55.737809	2017-01-09 22:29:26.863015	2	4	\N		\N	\N	\N	8		85g	32kts	12
25	Sea Ray 190 SPX 1		\N	2017-01-09 19:11:55.314992	2017-01-09 19:12:24.183412	0	5	\N		\N	\N	\N	\N				
24	Bayliner 170		\N	2017-01-09 19:06:32.545703	2017-01-09 21:17:24.736988	0	6	\N		\N	\N	\N	\N				
21	MasterCraft ProStar 190		1995	2017-01-09 19:02:16.020758	2017-01-09 22:35:04.774323	2	9	19	GM 350	\N	4	\N	\N				
22	MasterCraft X9		\N	2017-01-09 19:03:12.21267	2017-01-09 22:27:08.80826	2	9	\N		\N	\N	\N	\N				
26	Sea Ray 190 SPX 2		2016	2017-01-09 19:13:17.777654	2017-01-09 22:59:36.342317	0	5	19	150 HP	\N	6	\N	\N			28 knots	11
27	Mastercraft 190		1990	2017-01-09 22:33:02.154949	2017-01-09 22:37:35.243778	2	9	19	GM 350	\N	\N	\N	\N				
23	Ski Nautique 190		1990	2017-01-09 19:04:11.052872	2017-01-09 23:09:47.618416	2	9	19	GM 350	\N	4	\N	\N			32 knots	
\.


--
-- Data for Name: boats_booking_checklist_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY boats_booking_checklist_categories (boat_id, booking_checklist_category_id) FROM stdin;
26	14
26	12
26	11
26	7
26	6
26	2
25	14
25	12
25	11
25	7
25	6
25	2
24	14
24	12
24	11
24	7
24	6
24	2
23	14
23	12
23	11
23	7
23	5
23	2
22	14
22	12
22	11
22	10
22	7
22	5
22	2
21	14
21	12
21	11
21	10
21	7
21	5
21	2
20	14
20	12
20	11
20	10
20	7
20	6
20	2
19	14
19	12
19	11
19	10
19	7
19	6
19	2
18	14
18	12
18	11
18	10
18	7
18	6
18	2
17	14
17	12
17	11
17	7
17	6
17	2
16	14
16	12
16	11
16	7
16	6
16	2
15	14
15	12
15	11
15	6
15	7
15	2
14	14
14	12
14	11
14	7
14	6
14	2
13	14
13	12
13	11
13	7
13	3
13	2
12	14
12	12
12	11
12	7
12	3
12	4
12	2
11	14
11	12
11	11
11	10
11	9
11	8
11	7
11	4
11	3
11	2
10	14
10	12
10	11
10	10
10	9
10	8
10	7
10	4
10	3
10	2
9	14
9	12
9	11
9	10
9	9
9	8
9	7
9	4
9	3
9	2
8	14
8	12
8	11
8	7
8	3
8	2
7	14
7	12
7	11
7	7
7	3
7	2
6	14
6	12
6	11
6	8
6	4
6	3
6	2
6	7
5	14
5	12
5	11
5	10
5	9
5	8
5	7
5	4
5	3
5	2
4	14
4	12
4	11
4	10
4	9
4	8
4	7
4	4
4	3
4	2
3	14
3	12
3	11
3	10
3	9
3	8
3	7
3	5
3	4
3	2
2	14
2	12
2	11
2	10
2	9
2	8
2	7
2	4
2	3
2	2
27	14
27	12
27	11
27	7
27	5
27	2
\.


--
-- Name: boats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('boats_id_seq', 27, true);


--
-- Data for Name: booking_checklist_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY booking_checklist_categories (id, name, created_at, updated_at) FROM stdin;
2	stereo	2017-01-09 16:26:53.850462	2017-01-09 16:26:53.850462
4	marine head	2017-01-09 19:20:55.684686	2017-01-09 19:20:55.684686
3	inboard / outboard	2017-01-09 16:28:07.411779	2017-01-09 19:24:44.285568
5	inboard (mid engine)	2017-01-09 19:26:50.132297	2017-01-09 19:26:50.132297
6	ouboard	2017-01-09 19:31:35.895406	2017-01-09 19:31:35.895406
7	systems	2017-01-09 19:34:03.885153	2017-01-09 19:34:03.885153
8	shore power	2017-01-09 19:35:55.373934	2017-01-09 19:35:55.373934
9	Galley	2017-01-09 19:56:51.474066	2017-01-09 19:56:51.474066
10	Interior	2017-01-09 20:01:49.370325	2017-01-09 20:01:49.370325
11	Equipment list	2017-01-09 20:06:53.788319	2017-01-09 20:06:53.788319
12	Exterior seating area	2017-01-09 20:17:10.832736	2017-01-09 20:17:10.832736
14	Hull and exterior	2017-01-09 20:18:53.42251	2017-01-09 20:18:53.42251
\.


--
-- Name: booking_checklist_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('booking_checklist_categories_id_seq', 14, true);


--
-- Data for Name: booking_checklist_line_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY booking_checklist_line_items (id, name, category_id, created_at, updated_at) FROM stdin;
1	wipe down all vinyl surfaces	1	2017-01-09 16:25:50.252281	2017-01-09 16:25:50.252281
3	vacuum carpet	1	2017-01-09 16:25:50.254567	2017-01-09 16:25:50.254567
4	check operation of all speakers	2	2017-01-09 16:26:53.851673	2017-01-09 16:26:53.851673
5	check oil	3	2017-01-09 16:28:07.412986	2017-01-09 16:28:07.412986
8	toilet operational	4	2017-01-09 19:20:55.685953	2017-01-09 19:20:55.685953
9	toilet clean	4	2017-01-09 19:20:55.687078	2017-01-09 19:20:55.687078
10	vacu-flush switches off	4	2017-01-09 19:20:55.688078	2017-01-09 19:20:55.688078
11	all surfaces scubbed and clean	4	2017-01-09 19:20:55.689081	2017-01-09 19:20:55.689081
12	toilet paper stocked	4	2017-01-09 19:20:55.690097	2017-01-09 19:20:55.690097
13	head clean and fresh smelling	4	2017-01-09 19:20:55.691126	2017-01-09 19:20:55.691126
6	check power steering fluid	3	2017-01-09 16:28:07.419987	2017-01-09 19:24:44.287024
7	check coolant	3	2017-01-09 16:28:07.421005	2017-01-09 19:24:44.288316
14	bilge area clean	3	2017-01-09 19:24:44.289518	2017-01-09 19:24:44.289518
15	bilge pump operational	3	2017-01-09 19:24:44.290576	2017-01-09 19:24:44.290576
18	check oil	5	2017-01-09 19:26:50.133501	2017-01-09 19:26:50.133501
19	check transmission fluid	5	2017-01-09 19:26:50.134571	2017-01-09 19:26:50.134571
20	check coolant	5	2017-01-09 19:26:50.135556	2017-01-09 19:26:50.135556
21	bilge area clean	5	2017-01-09 19:26:50.136602	2017-01-09 19:26:50.136602
22	bilge pump operational	5	2017-01-09 19:26:50.137578	2017-01-09 19:26:50.137578
23	check oil	6	2017-01-09 19:31:35.896553	2017-01-09 19:31:35.896553
24	visual inspection of cover	6	2017-01-09 19:31:35.897679	2017-01-09 19:31:35.897679
25	inspect prop and skeg	6	2017-01-09 19:31:35.898711	2017-01-09 19:31:35.898711
26	turn so that ram is retracted	6	2017-01-09 19:31:35.899696	2017-01-09 19:31:35.899696
27	raise outboard	6	2017-01-09 19:31:35.900762	2017-01-09 19:31:35.900762
28	bow lights / red / green	7	2017-01-09 19:34:03.886299	2017-01-09 19:34:03.886299
29	anchor light	7	2017-01-09 19:34:03.887341	2017-01-09 19:34:03.887341
30	fuel gauge	7	2017-01-09 19:34:03.888373	2017-01-09 19:34:03.888373
31	tachometer	7	2017-01-09 19:34:03.889382	2017-01-09 19:34:03.889382
32	oil pressure	7	2017-01-09 19:34:03.890379	2017-01-09 19:34:03.890379
33	volt meter	7	2017-01-09 19:34:03.891364	2017-01-09 19:34:03.891364
34	battery off	7	2017-01-09 19:34:03.892397	2017-01-09 19:34:03.892397
35	engine off	8	2017-01-09 19:35:55.375054	2017-01-09 19:35:55.375054
36	cord secured and not in water	8	2017-01-09 19:35:55.376108	2017-01-09 19:35:55.376108
37	plugged in securely both ends	8	2017-01-09 19:35:55.37715	2017-01-09 19:35:55.37715
38	all 110v systems turned off	8	2017-01-09 19:35:55.378189	2017-01-09 19:35:55.378189
39	battery charger on	8	2017-01-09 19:35:55.379188	2017-01-09 19:35:55.379188
40	final visual check	8	2017-01-09 19:35:55.380218	2017-01-09 19:35:55.380218
16	visual check of engine compartment	3	2017-01-09 19:24:44.291595	2017-01-09 19:38:43.701876
17	check prop and skeg	3	2017-01-09 19:24:44.2926	2017-01-09 19:38:43.703383
41	outdrive down	3	2017-01-09 19:38:43.70465	2017-01-09 19:38:43.70465
46	Garbage empty	9	2017-01-09 19:56:51.479342	2017-01-09 19:56:51.479342
48	Procedure and equipment list on board	10	2017-01-09 20:01:49.371512	2017-01-09 20:20:26.672807
49	Carpet clean	10	2017-01-09 20:01:49.372692	2017-01-09 20:20:26.674175
50	Vinyl clean and undamaged	10	2017-01-09 20:01:49.373833	2017-01-09 20:20:26.675315
51	Spare bed compartment clean and tidy	10	2017-01-09 20:01:49.374857	2017-01-09 20:20:26.676522
52	Hatches and port lights undamaged	10	2017-01-09 20:01:49.375859	2017-01-09 20:20:26.677716
53	Windows clean	10	2017-01-09 20:01:49.376877	2017-01-09 20:20:26.678906
54	Tables clean	10	2017-01-09 20:01:49.377861	2017-01-09 20:20:26.680085
79	Instruments and gauges operational	13	2017-01-09 20:17:40.436605	2017-01-09 22:09:27.226581
80	Fuel at 3/4 or greater	13	2017-01-09 20:17:40.437679	2017-01-09 22:09:27.22796
55	clean under seats	10	2017-01-09 20:01:49.378843	2017-01-09 20:22:29.258059
56	Storage compartments clean	10	2017-01-09 20:01:49.379843	2017-01-09 20:22:29.259518
66	Windows clean	12	2017-01-09 20:17:10.833916	2017-01-09 22:09:59.527687
67	Vinyl clean	12	2017-01-09 20:17:10.835038	2017-01-09 22:09:59.52907
68	Vinyl undamaged	12	2017-01-09 20:17:10.83602	2017-01-09 22:09:59.530256
69	Gelcoat undamaged	12	2017-01-09 20:17:10.837052	2017-01-09 22:09:59.531682
70	Swim ladder up	12	2017-01-09 20:17:10.838076	2017-01-09 22:09:59.53291
71	Bimini, mounts, and canvas undamaged	12	2017-01-09 20:17:10.839106	2017-01-09 22:09:59.534084
72	Deck clean	12	2017-01-09 20:17:10.840155	2017-01-09 22:09:59.535298
73	Carpet clean	12	2017-01-09 20:17:10.841194	2017-01-09 22:09:59.536566
74	Compartments clean	12	2017-01-09 20:17:10.842216	2017-01-09 22:09:59.537792
75	Wiped unders seats	12	2017-01-09 20:17:10.84323	2017-01-09 22:09:59.539025
76	Surfaces wiped down	12	2017-01-09 20:17:10.84427	2017-01-09 22:09:59.540229
77	Under deck storage compartment/bilge clean and free of water	12	2017-01-09 20:17:10.845248	2017-01-09 22:09:59.541404
81	Hull undamaged	14	2017-01-09 20:18:53.42368	2017-01-09 22:10:17.620895
82	Gelcoat undamaged	14	2017-01-09 20:18:53.424721	2017-01-09 22:10:17.622283
83	Swim platform undamaged	14	2017-01-09 20:18:53.425704	2017-01-09 22:10:17.623471
84	Swim step(s) undamaged	14	2017-01-09 20:18:53.42669	2017-01-09 22:10:17.624703
85	Paint undamaged	14	2017-01-09 20:18:53.427663	2017-01-09 22:10:17.625909
57	2 uncut mooring lines	11	2017-01-09 20:06:53.789477	2017-01-09 22:10:43.102891
58	3 Fenders	11	2017-01-09 20:06:53.790595	2017-01-09 22:10:43.104312
59	Boat hook present and undamaged	11	2017-01-09 20:06:53.791631	2017-01-09 22:10:43.105496
60	3 flares unexpired	11	2017-01-09 20:06:53.79267	2017-01-09 22:10:43.106837
61	Air horn unopened and/or operational	11	2017-01-09 20:06:53.793692	2017-01-09 22:10:43.108165
62	Fire exinguisher charged	11	2017-01-09 20:06:53.794714	2017-01-09 22:10:43.109403
63	Boat registration on board	11	2017-01-09 20:06:53.795796	2017-01-09 22:10:43.110739
64	Equipment location diagram on board	11	2017-01-09 20:06:53.796827	2017-01-09 22:10:43.112005
65	6 Life jackets on board	11	2017-01-09 20:06:53.797863	2017-01-09 22:10:43.113238
42	Fridge clean and operational	9	2017-01-09 19:56:51.475228	2017-01-09 22:10:53.098666
43	Microwave clean and operational	9	2017-01-09 19:56:51.476303	2017-01-09 22:10:53.100105
44	Surfaces clean	9	2017-01-09 19:56:51.477359	2017-01-09 22:10:53.101325
45	Stovetop operational and clean	9	2017-01-09 19:56:51.478354	2017-01-09 22:10:53.102612
47	Cabinets and drawers clean	9	2017-01-09 19:56:51.480363	2017-01-09 22:10:53.103976
\.


--
-- Name: booking_checklist_line_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('booking_checklist_line_items_id_seq', 85, true);


--
-- Data for Name: booking_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY booking_images (id, photo_type, image, booking_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: booking_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('booking_images_id_seq', 1, false);


--
-- Data for Name: booking_line_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY booking_line_items (id, booking_id, booking_checklist_line_item_id, value, image) FROM stdin;
\.


--
-- Name: booking_line_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('booking_line_items_id_seq', 1, false);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY bookings (id, user_id, boat_class_id, boat_id, start_date, end_date, user_notes, status, amount, assigned_staff_id, activated_staff_id, completed_staff_id, created_at, updated_at, booking_type, start_booking_at, complete_notes) FROM stdin;
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('bookings_id_seq', 1, false);


--
-- Data for Name: charges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY charges (id, stripe_charge_id, booking_id, description, amount, status, charge_type, staff_id, refund_amount, created_at, updated_at, stripe_source_id, source, user_id, ref_charge_id) FROM stdin;
1	\N	\N	\N	100	0	5	\N	\N	2017-01-09 13:29:50.70171	2017-01-09 13:29:50.70171	\N	2	1	\N
2	\N	\N	\N	500	0	6	\N	\N	2017-01-09 13:29:50.708166	2017-01-09 13:29:50.708166	\N	2	1	\N
3	\N	\N	\N	100	0	5	\N	\N	2017-01-09 13:34:57.033962	2017-01-09 13:34:57.033962	\N	2	2	\N
4	\N	\N	\N	500	0	6	\N	\N	2017-01-09 13:34:57.03745	2017-01-09 13:34:57.03745	\N	2	2	\N
5	\N	\N	\N	100	0	5	\N	\N	2017-01-09 15:05:00.761191	2017-01-09 15:05:00.761191	\N	2	3	\N
6	\N	\N	\N	500	0	6	\N	\N	2017-01-09 15:05:00.764914	2017-01-09 15:05:00.764914	\N	2	3	\N
7	\N	\N	\N	1000	0	5	\N	\N	2017-01-09 16:10:38.317823	2017-01-09 16:10:38.317823	\N	2	4	\N
8	\N	\N	\N	3600	0	6	\N	\N	2017-01-09 16:10:38.321573	2017-01-09 16:10:38.321573	\N	2	4	\N
9	\N	\N	\N	1000	0	5	\N	\N	2017-01-09 17:51:23.974995	2017-01-09 17:51:23.974995	\N	2	5	\N
10	\N	\N	\N	3600	0	6	\N	\N	2017-01-09 17:51:23.978824	2017-01-09 17:51:23.978824	\N	2	5	\N
11	\N	\N	\N	1000	0	5	\N	\N	2017-01-09 19:49:34.656312	2017-01-09 19:49:34.656312	\N	2	6	\N
12	\N	\N	\N	3600	0	6	\N	\N	2017-01-09 19:49:34.659881	2017-01-09 19:49:34.659881	\N	2	6	\N
13	\N	\N	\N	1000	0	5	\N	\N	2017-01-09 22:03:33.839283	2017-01-09 22:03:33.839283	\N	2	7	\N
14	\N	\N	\N	3600	0	6	\N	\N	2017-01-09 22:03:33.842852	2017-01-09 22:03:33.842852	\N	2	7	\N
\.


--
-- Name: charges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('charges_id_seq', 14, true);


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY groups (id, membership_type, name, created_at, updated_at) FROM stdin;
\.


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('groups_id_seq', 1, false);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY roles (id, name, resource_type, resource_id, created_at, updated_at) FROM stdin;
1	user_single	\N	\N	2017-01-09 13:29:50.651759	2017-01-09 13:29:50.651759
2	admin	\N	\N	2017-01-09 13:30:32.685322	2017-01-09 13:30:32.685322
3	dock	\N	\N	2017-01-09 13:30:32.693518	2017-01-09 13:30:32.693518
5	mid_week	\N	\N	2017-01-09 13:30:32.698285	2017-01-09 13:30:32.698285
\.


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('roles_id_seq', 5, true);


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY schema_migrations (version) FROM stdin;
20170105003838
20161005161712
20161111053111
20161126100904
20161203054544
20161101162943
20161017141922
20161209034500
20161021132639
20161212023541
20161113062820
20161028155711
20161102142302
20161222133037
20161105135246
20161006005830
20161201010234
20161204012833
20161005023744
20161209061419
20161206162517
20161205112011
20161028040501
20161012034224
20161017142212
20161007121342
20161112025642
20161203033724
20161205052659
20161207014716
20161015093142
20161208044738
20161122073205
20161112084158
20161022041555
20161011051253
20161209094309
20161210140817
20161202114718
20161202050415
20161203034754
20161211132625
20161203155048
20161130160726
20161018222745
20161014025954
20161208045409
20161008080742
20161015032526
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY settings (id, var, value, thing_id, thing_type, created_at, updated_at) FROM stdin;
1	season_start_date	--- '2017-03-01'\n	\N	\N	2017-01-09 15:11:36.326826	2017-01-09 15:11:36.326826
2	season_end_date	--- '2017-10-29'\n	\N	\N	2017-01-09 15:11:36.335161	2017-01-09 15:11:36.335161
3	peak_season_start_date	--- '2017-05-27'\n	\N	\N	2017-01-09 15:11:36.339639	2017-01-09 15:11:36.339639
4	peak_season_end_date	--- '2017-09-04'\n	\N	\N	2017-01-09 15:11:36.343554	2017-01-09 15:11:36.343554
5	security_deposit_single_user	--- '1000'\n	\N	\N	2017-01-09 15:11:36.34737	2017-01-09 15:11:36.34737
6	security_deposit_mid_week_user	--- '1000'\n	\N	\N	2017-01-09 15:11:36.35088	2017-01-09 15:11:36.35088
7	security_deposit_group_user	--- '1000'\n	\N	\N	2017-01-09 15:11:36.35457	2017-01-09 15:11:36.35457
8	membership_single_user	--- '3600'\n	\N	\N	2017-01-09 15:11:36.358397	2017-01-09 15:11:36.358397
9	membership_mid_week_user	--- '2700'\n	\N	\N	2017-01-09 15:11:36.361928	2017-01-09 15:11:36.361928
11	gallon_price	--- '4.20'\n	\N	\N	2017-01-09 15:11:36.369366	2017-01-09 15:11:36.369366
12	pending_charge_message	--- There may be some other charges after use such as excessive required cleaning,\n  damage or missing equipment. Take care of your boat and you will never see these\n  charges!\n...\n	\N	\N	2017-01-09 15:11:36.373198	2017-01-09 15:13:12.591435
13	ui_booking_intro	--- Select your boat class, your dates, and go boating!\n...\n	\N	\N	2017-01-09 15:11:36.377118	2017-01-09 15:15:30.955781
14	ui_booking_hh_intro	--- It's happy hour!  Select your boat class, your dates, and go boating.\n...\n	\N	\N	2017-01-09 15:11:36.3808	2017-01-09 15:15:30.959967
16	endorsement_check_list	--- "[\\n\\t{\\n\\t\\t\\"type\\": \\"checkbox\\",\\n\\t\\t\\"required\\": true,\\n\\t\\t\\"label\\":\n  \\"Signed contract\\",\\n\\t\\t\\"className\\": \\"checkbox\\",\\n\\t\\t\\"name\\": \\"checkbox-1483977509758\\"\\n\\t},\\n\\t{\\n\\t\\t\\"type\\":\n  \\"checkbox\\",\\n\\t\\t\\"required\\": true,\\n\\t\\t\\"label\\": \\"Evaluation\\",\\n\\t\\t\\"className\\":\n  \\"checkbox\\",\\n\\t\\t\\"name\\": \\"checkbox-1483977553683\\"\\n\\t},\\n\\t{\\n\\t\\t\\"type\\":\n  \\"checkbox\\",\\n\\t\\t\\"required\\": true,\\n\\t\\t\\"label\\": \\"Dock checkout\\",\\n\\t\\t\\"className\\":\n  \\"checkbox\\",\\n\\t\\t\\"name\\": \\"checkbox-1483977573510\\"\\n\\t},\\n\\t{\\n\\t\\t\\"type\\":\n  \\"checkbox\\",\\n\\t\\t\\"label\\": \\"After hours boat use\\",\\n\\t\\t\\"className\\": \\"checkbox\\",\\n\\t\\t\\"name\\":\n  \\"checkbox-1483977732456\\"\\n\\t},\\n\\t{\\n\\t\\t\\"type\\": \\"checkbox\\",\\n\\t\\t\\"label\\":\n  \\"Locks endorsement - Blake Island to Paulsbo\\",\\n\\t\\t\\"className\\": \\"checkbox\\",\\n\\t\\t\\"name\\":\n  \\"checkbox-1483977676190\\"\\n\\t},\\n\\t{\\n\\t\\t\\"type\\": \\"checkbox\\",\\n\\t\\t\\"label\\":\n  \\"Unlimited Geographic endorsement\\",\\n\\t\\t\\"className\\": \\"checkbox\\",\\n\\t\\t\\"name\\":\n  \\"checkbox-1483977761837\\"\\n\\t}\\n]"\n	\N	\N	2017-01-09 15:51:19.255296	2017-01-09 16:04:57.83532
10	membership_group_user	--- '2300'\n	\N	\N	2017-01-09 15:11:36.365652	2017-01-09 22:22:39.212507
15	holidays	--- '[{"name":"Independence Day","date":"2017-07-04"},{"name":"Memorial Day","date":"2017-05-29"},{"name":"Labor\n  Day","date":"2017-09-04"},{"name":"Seafair Friday","date":"2017-08-04"}]'\n	\N	\N	2017-01-09 15:11:36.396417	2017-01-09 22:24:32.660633
\.


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('settings_id_seq', 16, true);


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY transactions (id, booking_id, staff_id, amount, description, in_out, created_at, updated_at, status, charge_id, source, card_last4, balance) FROM stdin;
\.


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('transactions_id_seq', 1, false);


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY user_profiles (id, wa_state_marine_photo, wa_state_marine_field, driver_license_photo, driver_license_field, user_id, created_at, updated_at) FROM stdin;
1	\N	\N	\N	\N	1	2017-01-09 13:29:50.668933	2017-01-09 13:29:50.668933
2	\N	\N	\N	\N	2	2017-01-09 13:34:57.029075	2017-01-09 13:34:57.029075
3	\N	\N	\N	\N	3	2017-01-09 15:05:00.746359	2017-01-09 15:05:00.746359
4	\N	\N	\N	\N	4	2017-01-09 16:10:38.313179	2017-01-09 16:10:38.313179
6	\N	\N	\N	\N	6	2017-01-09 19:49:34.651796	2017-01-09 19:49:34.651796
\.


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_profiles_id_seq', 7, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (id, email, encrypted_password, reset_password_token, reset_password_sent_at, remember_created_at, sign_in_count, current_sign_in_at, last_sign_in_at, current_sign_in_ip, last_sign_in_ip, created_at, updated_at, first_name, last_name, phone, fax, address, stripe_customer_id, profile_picture, group_id, balance, is_active, security_deposit_charge_id, endorsement) FROM stdin;
1	don.nguyen@hazuu.com	$2a$11$8aLHfOxw5bQuxixU41uy2.Q4TT0l4vzh8Eu0SwdIqSGIUnfpdp3oK	\N	\N	\N	1	2017-01-09 13:32:02.262669	2017-01-09 13:32:02.262669	180.93.249.157	180.93.249.157	2017-01-09 13:29:50.620754	2017-01-09 13:33:25.38703	Don	Nguyen				\N	\N	\N	0	t	\N	\N
4	cross@spiderboxdesign.com	$2a$11$Sz/tAAqB.apXkkIZLte/KO2.tgpdLvwxGjRyO3K2kogfiFLr5YLWe	\N	\N	\N	1	2017-01-09 16:10:51.774506	2017-01-09 16:10:51.774506	75.165.49.146	75.165.49.146	2017-01-09 16:10:38.304467	2017-01-09 16:10:51.775787	Daniel	Cross	\N	\N	\N	\N	\N	\N	0	t	\N	\N
6	aaron@seattleboatshare.com	$2a$11$vQh7wg/7GjEY2tuWkYtRke0rdnpCwFSERdeKzN2UdOVzNMNCxSBDy	\N	\N	\N	1	2017-01-09 19:53:24.022949	2017-01-09 19:53:24.022949	75.165.49.146	75.165.49.146	2017-01-09 19:49:34.647208	2017-01-09 19:53:24.024406	Aaron	Bronson				\N	\N	\N	0	t	\N	\N
2	xy@spiderboxdesign.com	$2a$11$gAgc6MP4.nB2ea3oA765feQjGHlR3O.MWhR7n6jOV1qkuSp6tGarG	\N	\N	\N	4	2017-01-09 20:20:08.649753	2017-01-09 15:03:25.556142	75.165.49.146	75.165.49.146	2017-01-09 13:34:57.024924	2017-01-09 20:20:08.651266	Daniel	Cross				\N	\N	\N	0	t	\N	\N
3	jim@seattleboatshare.com	$2a$11$tz8my33xCZ8paKrnHOBN6eG.et3/bYxrAgq3m1fngJbFu4sSyH5Am	\N	\N	\N	6	2017-01-09 22:20:19.316631	2017-01-09 22:07:46.193548	75.165.49.146	75.165.49.146	2017-01-09 15:05:00.742402	2017-01-09 22:20:19.318236	Jim	Lowry				\N	\N	\N	0	t	\N	\N
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 7, true);


--
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users_roles (user_id, role_id) FROM stdin;
1	2
2	2
3	2
4	1
6	2
\.


--
-- Name: ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: billing_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY billing_addresses
    ADD CONSTRAINT billing_addresses_pkey PRIMARY KEY (id);


--
-- Name: boat_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boat_amenities
    ADD CONSTRAINT boat_amenities_pkey PRIMARY KEY (id);


--
-- Name: boat_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boat_classes
    ADD CONSTRAINT boat_classes_pkey PRIMARY KEY (id);


--
-- Name: boat_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boat_images
    ADD CONSTRAINT boat_images_pkey PRIMARY KEY (id);


--
-- Name: boats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boats
    ADD CONSTRAINT boats_pkey PRIMARY KEY (id);


--
-- Name: booking_checklist_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_checklist_categories
    ADD CONSTRAINT booking_checklist_categories_pkey PRIMARY KEY (id);


--
-- Name: booking_checklist_line_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_checklist_line_items
    ADD CONSTRAINT booking_checklist_line_items_pkey PRIMARY KEY (id);


--
-- Name: booking_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_images
    ADD CONSTRAINT booking_images_pkey PRIMARY KEY (id);


--
-- Name: booking_line_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_line_items
    ADD CONSTRAINT booking_line_items_pkey PRIMARY KEY (id);


--
-- Name: bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: charges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY charges
    ADD CONSTRAINT charges_pkey PRIMARY KEY (id);


--
-- Name: groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: boat_classes_users_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX boat_classes_users_index ON boat_classes_users USING btree (boat_class_id, user_id);


--
-- Name: boats_booking_checklist_categories_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX boats_booking_checklist_categories_index ON boats_booking_checklist_categories USING btree (boat_id, booking_checklist_category_id);


--
-- Name: bookings_booking_checklist_line_items_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX bookings_booking_checklist_line_items_index ON booking_line_items USING btree (booking_id, booking_checklist_line_item_id);


--
-- Name: index_billing_addresses_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_billing_addresses_on_user_id ON billing_addresses USING btree (user_id);


--
-- Name: index_boat_images_on_boat_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_boat_images_on_boat_id ON boat_images USING btree (boat_id);


--
-- Name: index_boats_on_boat_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_boats_on_boat_class_id ON boats USING btree (boat_class_id);


--
-- Name: index_booking_checklist_line_items_on_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_booking_checklist_line_items_on_category_id ON booking_checklist_line_items USING btree (category_id);


--
-- Name: index_booking_images_on_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_booking_images_on_booking_id ON booking_images USING btree (booking_id);


--
-- Name: index_booking_line_items_on_booking_checklist_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_booking_line_items_on_booking_checklist_line_item_id ON booking_line_items USING btree (booking_checklist_line_item_id);


--
-- Name: index_booking_line_items_on_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_booking_line_items_on_booking_id ON booking_line_items USING btree (booking_id);


--
-- Name: index_bookings_on_activated_staff_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_bookings_on_activated_staff_id ON bookings USING btree (activated_staff_id);


--
-- Name: index_bookings_on_assigned_staff_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_bookings_on_assigned_staff_id ON bookings USING btree (assigned_staff_id);


--
-- Name: index_bookings_on_boat_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_bookings_on_boat_class_id ON bookings USING btree (boat_class_id);


--
-- Name: index_bookings_on_boat_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_bookings_on_boat_id ON bookings USING btree (boat_id);


--
-- Name: index_bookings_on_completed_staff_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_bookings_on_completed_staff_id ON bookings USING btree (completed_staff_id);


--
-- Name: index_bookings_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_bookings_on_user_id ON bookings USING btree (user_id);


--
-- Name: index_charges_on_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_charges_on_booking_id ON charges USING btree (booking_id);


--
-- Name: index_charges_on_ref_charge_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_charges_on_ref_charge_id ON charges USING btree (ref_charge_id);


--
-- Name: index_charges_on_staff_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_charges_on_staff_id ON charges USING btree (staff_id);


--
-- Name: index_charges_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_charges_on_user_id ON charges USING btree (user_id);


--
-- Name: index_roles_on_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_roles_on_name ON roles USING btree (name);


--
-- Name: index_roles_on_name_and_resource_type_and_resource_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_roles_on_name_and_resource_type_and_resource_id ON roles USING btree (name, resource_type, resource_id);


--
-- Name: index_settings_on_thing_type_and_thing_id_and_var; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_settings_on_thing_type_and_thing_id_and_var ON settings USING btree (thing_type, thing_id, var);


--
-- Name: index_transactions_on_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_transactions_on_booking_id ON transactions USING btree (booking_id);


--
-- Name: index_transactions_on_charge_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_transactions_on_charge_id ON transactions USING btree (charge_id);


--
-- Name: index_transactions_on_staff_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_transactions_on_staff_id ON transactions USING btree (staff_id);


--
-- Name: index_user_profiles_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_user_profiles_on_user_id ON user_profiles USING btree (user_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_on_group_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_users_on_group_id ON users USING btree (group_id);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON users USING btree (reset_password_token);


--
-- Name: index_users_on_security_deposit_charge_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_users_on_security_deposit_charge_id ON users USING btree (security_deposit_charge_id);


--
-- Name: index_users_roles_on_user_id_and_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_users_roles_on_user_id_and_role_id ON users_roles USING btree (user_id, role_id);


--
-- Name: fk_rails_4e6c7035aa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boats
    ADD CONSTRAINT fk_rails_4e6c7035aa FOREIGN KEY (boat_class_id) REFERENCES boat_classes(id);


--
-- Name: fk_rails_609cc718fc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY charges
    ADD CONSTRAINT fk_rails_609cc718fc FOREIGN KEY (booking_id) REFERENCES bookings(id);


--
-- Name: fk_rails_87a6352e58; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_profiles
    ADD CONSTRAINT fk_rails_87a6352e58 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: fk_rails_b2640848f6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY billing_addresses
    ADD CONSTRAINT fk_rails_b2640848f6 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: fk_rails_c99fc255ac; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY booking_images
    ADD CONSTRAINT fk_rails_c99fc255ac FOREIGN KEY (booking_id) REFERENCES bookings(id);


--
-- Name: fk_rails_e76839a97c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT fk_rails_e76839a97c FOREIGN KEY (booking_id) REFERENCES bookings(id);


--
-- Name: fk_rails_ef0571f117; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY bookings
    ADD CONSTRAINT fk_rails_ef0571f117 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: fk_rails_f40b3f4da6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_rails_f40b3f4da6 FOREIGN KEY (group_id) REFERENCES groups(id);


--
-- Name: fk_rails_f8826eab3c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT fk_rails_f8826eab3c FOREIGN KEY (charge_id) REFERENCES charges(id);


--
-- Name: fk_rails_fd11e10fe3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY bookings
    ADD CONSTRAINT fk_rails_fd11e10fe3 FOREIGN KEY (boat_class_id) REFERENCES boat_classes(id);


--
-- Name: fk_rails_fd91000e55; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY boat_images
    ADD CONSTRAINT fk_rails_fd91000e55 FOREIGN KEY (boat_id) REFERENCES boats(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

