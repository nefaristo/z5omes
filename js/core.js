// -----------------------------
// ========== Lexical ==========
// -----------------------------

// * "fig" is a polygon/figure
// * "faces" are the division of a figure into triangles for 3D representation
// * "vertices", "point" or "vector" are just 3D point array [x, y, z]
// * "vector" is a direction
// * "segment" is an array of two points

// ------------------------------------
// ========== Constants ==========
// ------------------------------------

const TAU = 2 * Math.PI;    // 360° in rad
const TAU_Q = Math.PI / 2;  // 90° in rad
const FLOAT_PRECISION = 7;
const FLOAT_2_STR_PRECISION = 2;

const ASSEMBLY_DIRECTIONS = ["Clockwise Rotation", "Counterclockwise Rotation", "Symmetry Axis"]


check_is_mobile = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

const IS_MOBILE = check_is_mobile();


// --------------------------------
// ========== URL Params ==========
// --------------------------------

function decode_url_params(key) {
    const url = new URLSearchParams(window.location.search);
    const query_param = url.get(key)
    const decoded_params = (query_param) ? JSON.parse(atob(query_param)) : {};
    return decoded_params;
}


function encode_params(params) {
    return btoa(JSON.stringify(params));
}

function small_hash(params) {
    const param_values = _.map(params, value => {
        switch (typeof value) {
            case 'number':
                return to_decimal(value);    // Trunc number
            case 'boolean':
                return +value;                          // Convert to int
            default:
                return value;
        }
    });

    let param_str = `${param_values}`.replaceAll('[', '')
        .replaceAll(']', '')
        .replaceAll(',', '')
        .replaceAll('', '')

    param_str = _.reduce(`${param_str}`, (res, c) => res += c.charCodeAt(0), 0)
    const hash = btoa(param_str).replaceAll('=', '');
    return hash;
}

function sync_params_from_url(params, key = "q") {
    const decoded_params = decode_url_params(key)

    // Merge params with decoded params
    if (decoded_params) {
        _.forEach(params, (value, key) => {
            // Check if decoded_params has the property
            if (decoded_params.hasOwnProperty(key)) {
                const new_value = decoded_params[key];
                params[key] = (new_value === undefined || new_value === null) ? value : new_value;
            }
        });
    }
    return params;
}

function __sync_url_from_params(params, key = "q") {
    if (!params) return;

    let url = new URL(window.location.href);
    url.searchParams.set(key, encode_params(params));
    history.replaceState(null, document.title, url.toString());
}

const sync_url_from_params = _.debounce(__sync_url_from_params, 1000);


// -----------------------------------
// ========== 3D Operations ==========
// -----------------------------------

function add(p1, p2) {
    // Add two 3D points
    return [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];
}

function sub(p1, p2) {
    // Subtract two 3D points
    return [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
}

function mul(p1, k) {
    // Multiply a 3D point by k
    return [p1[0] * k, p1[1] * k, p1[2] * k];
}

function swap_axes(points, axes_order = "XYZ") {
    return points.map(p => {
        const reordered_point = [p[0], p[1], p[2]];
        const axis_indexes = ["X", "Y", "Z"].map(c => axes_order.indexOf(c));
        for (let i = 0; i < 3; i++) {
            const axis_index = axis_indexes[i];
            if (axis_index === -1) {
                console.error("Please use only one X, Y, Z for the axes_order");
                return;
            }
            reordered_point[axis_index] = p[i];
        }
        ;
        return reordered_point;
    });
}


function dot_product(vec1, vec2) {
    // The dot product or scalar product of two 3D vectors (or points
    // because a point can be represented as a position vector from the origin).
    return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
}


function cross_product(vec1, vec2) {
    // Also named 'vector product', the cross product is perpendicular to vec1 and vec2
    // https://en.wikipedia.org/wiki/Cross_product
    return [
        vec1[1] * vec2[2] - vec1[2] * vec2[1],
        vec1[2] * vec2[0] - vec1[0] * vec2[2],
        vec1[0] * vec2[1] - vec1[1] * vec2[0]
    ];
}

function project(vec1, vec2) {
    // Project vec2 on vec1
    const square2 = squared_norm(vec2, vec2);
    return mul(vec2, dot_product(vec1, vec2) / square2);
}

function squared_norm(vec) {
    // Compute the squared norm of the vector
    return dot_product(vec, vec);
}

function len(vec) {
    // Compute the length (magnitude) of vector
    return Math.sqrt(squared_norm(vec));
}

function dist(p1, p2) {
    // Compute the distance between two 3D points
    return len(sub(p2, p1));
}

function norm(vec) {
    // Normalizing a vector consists of transforming it so that its norm (or magnitude)
    // becomes equal to 1 while preserving its direction.
    return mul(vec, 1 / len(vec));
}

function midpoint(p1, p2) {
    // Find the midpoint of a segment/line
    return mul(add(p1, p2), 0.5);
}

function point_between(p1, p2, d) {
    // Find point at distance d between two points (from p1 to p2)
    // ex : find_point([50, 0, 0], [100, 0, 0], 20)  =>  [70, 0, 0]
    const vec = sub(p2, p1)
    return point_to(p1, vec, d);
}

function point_to(p1, vec, d) {
    // Find point at distance d from origin p1 to direction vec
    const normalized_vec = norm(vec);
    const point = add(p1, mul(normalized_vec, d))
    return point;
}

function angle_between_vectors(u, v) {
    const dot = dot_product(u, v);
    const u_length = len(u);
    const v_length = len(v);

    const theta = Math.acos(dot / (u_length * v_length));
    return theta;
}

function points_2_plane(p1, p2, p3) {
    // Create plan from 3 points
    const vec1 = sub(p2, p1)
    const vec2 = sub(p3, p1)

    const norm_vec = cross_product(vec1, vec2)
    const d = -dot_product(norm_vec, p1)
    return [norm_vec[0], norm_vec[1], norm_vec[2], d]
}

function triangle_area_from_points(A, B, C) {
    // Heron formula to compute area of the triangle
    const ab = dist(A, B);
    const bc = dist(B, C);
    const ca = dist(C, A);
    const s = (ab + bc + ca) / 2;
    const area = Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));
    return area;
}

function plan_intersection(p1, vec1, plane1) {
    const [a, b, c, d] = plane1;

    // Calculation of the parameter t of the line at the intersection with the plane
    const t = -(a * p1[0] + b * p1[1] + c * p1[2] + d) /
        (a * vec1[0] + b * vec1[1] + c * vec1[2]);

    // Calculation of intersection point coordinates
    const intersection_point = add(p1, mul(vec1, t))
    return intersection_point;
}

function intersect(p, v, q, u) {
    // Find the intersection between two lines in 3D defined by
    // p = line1 point, v = line1 direction, q = line2 point, u = line2 direction
    const a = cross_product(v, u)
    const dot = dot_product(a, a)

    // if v and u are parallel (v x u = 0), then no intersection, return NaN point
    if (dot === 0) {
        return [NaN, NaN, NaN];
    }

    // b = (q-p) x u
    const b = cross_product(sub(q, p), u);

    // t = (b.a)/(a.a) = ((Q1-P1) x u) .(v x u) / (v x u) . (v x u)
    const t = dot_product(b, a) / dot;

    // find intersection point by substituting t to the line1 eq
    const point = add(p, mul(v, t))
    return point;
}

function angle(p1, p2, p3) {
    // Compute the angle of 3 points in radians
    const a = dist(p2, p3);
    const b = dist(p1, p2);
    const c = dist(p1, p3);
    return Math.acos((c * c - a * a - b * b) / (-2 * a * b)) || 0;
}

function angle_without_one_axis(p1, p2, p3, hidden_axis) {
    // angle_without_one_axis cannot work because we loose the direction... please use angle_between vecs
    switch (hidden_axis) {
        case "x":
        case "X":
        case "roll":
            return angle_between_vectors(
                sub([0, p1[1], p1[2]], [0, p2[1], p2[2]]),
                sub([0, p3[1], p3[2]], [0, p2[1], p2[2]])
            );
        case "y":
        case "Y":
        case "pitch":
            return angle_between_vectors(
                sub([p1[0], 0, p1[2]], [p2[0], 0, p2[2]]),
                sub([p3[0], 0, p3[2]], [p2[0], 0, p2[2]])
            );
        case "z":
        case "Z":
        case "yaw":
            return angle_between_vectors(
                sub([p1[0], p1[1], 0], [p2[0], p2[1], 0]),
                sub([p3[0], p3[1], 0], [p2[0], p2[1], 0])
            );
        default:
            return 0;
    }
}

function calculate_euler_angles(point1, point2) {
    // Calcul du vecteur
    const [dx, dy, dz] = sub(point2, point1);

    // Calcul de l'angle de yaw (rotation autour de l'axe z)
    const yaw = Math.atan2(dy, dx);

    // Projection des vecteurs sur le plan xy
    const dxProjected = Math.sqrt(dx * dx + dy * dy);
    const pitch = Math.atan2(dz, dxProjected);

    // Calcul de l'angle de roll (rotation autour de l'axe x)
    const roll = Math.atan2(dy, dz);

    return [pitch, roll, yaw];
}

function rotate_point_around_z_axis(vec, theta, origin = [0, 0, 0]) {
    const sin_theta = Math.sin(theta);
    const cos_theta = Math.cos(theta);

    // Rotate an 2D vector around z axis with an origin
    let delta = sub(vec, origin);
    return [
        delta[0] * cos_theta - delta[1] * sin_theta + origin[0],
        delta[0] * sin_theta + delta[1] * cos_theta + origin[1],
        vec[2] + origin[2]
    ];
}

function dihedral_angle(a, b, c) {
    // Compute the dihedral angle from 3 angles
    // https://www.had2know.org/academics/dihedral-angle-calculator-polyhedron.html
    return Math.acos(
        (Math.cos(a) - (Math.cos(b) * Math.cos(c))) / (Math.sin(b) * Math.sin(c))
    )
}

function dihedral_angle_between_planes(plane1, plane2) {
    const dot = dot_product(plane1, plane2);
    const theta = Math.PI - Math.acos(dot / (len(plane1) * len(plane2)));
    return theta;
}

function rotation_matrix_from_points(a, b, c) {
    const axis1 = new THREE.Vector3(...sub(a, b)).normalize()
    const axis2 = new THREE.Vector3(...sub(c, b)).normalize()
    const axis3 = new THREE.Vector3().crossVectors(axis1, axis2).normalize();
    return new THREE.Matrix4().makeBasis(axis1, axis2, axis3);
}

function flatten_3D_points(points, origin, start_pt1, start_pt2, horizontally = true) {
    // Flattens the 3D points with the origin at zero to 2D points
    // and the start_pt1 is aligned on x axis if horizontally is true, y axis otherwise
    // Use quaternion method to flat points

    // Compute the angle/distances with the origin point
    const theta = angle(start_pt1, origin, start_pt2);
    const dist_2_pt1 = dist(origin, start_pt1);
    const dist_2_pt2 = dist(origin, start_pt2);

    // Define end points depends on horizontally variable
    const zero = [0, 0, 0];
    const end_pt1 = (horizontally)
        ? [dist_2_pt1, 0, 0]
        : [0, dist_2_pt1, 0];
    const end_pt2 = (horizontally)
        ? rotate_point_around_z_axis([dist_2_pt2, 0, 0], -theta)
        : rotate_point_around_z_axis([0, dist_2_pt2, 0], theta);

    // Compute quaternion : source from https://jsfiddle.net/v6bkg4wf/2/
    const matrix1 = rotation_matrix_from_points(start_pt1, origin, start_pt2).invert();
    const matrix2 = rotation_matrix_from_points(end_pt1, zero, end_pt2);
    const Q = new THREE.Quaternion();
    Q.setFromRotationMatrix(matrix2.multiply(matrix1));

    // Apply quaternion and sub translation vec to planar the face
    const flattened_points = new Array(points.length);
    const translation_vec = new THREE.Vector3(...points[0]).applyQuaternion(Q);
    _.forEach(points, (point, i) => {
        flattened_points[i] = new THREE.Vector3(...point)
            .applyQuaternion(Q).sub(translation_vec)
            .toArray();
    });

    return flattened_points;
}

function is_coplanar(points) {
    // Function to check the coplanarity of a polygon
    // Calculation of the normal vector of the first triangle formed by the first three points
    const vec1 = sub(points[1], points[0]);
    const vec2 = sub(points[2], points[0]);
    const norm_vec = cross_product(vec1, vec2);
    const num_points = points.length;

    if (num_points > 3) {
        // Checking coplanarity by checking that the scalar product of the normal vectors
        // of each face of the polygon is close to zero (due to numerical approximations)
        for (let i = 3; i < num_points; i++) {
            const vec_to_check = sub(points[i], points[0])
            if (Math.abs(dot_product(norm_vec, vec_to_check)) > 0.000001) {
                return false;
            }
        }
    }
    return true;
}


// ---------------------------------
// ========== Conversions ==========
// ---------------------------------

function deg2rad(deg) {
    // Convert degrees to radians
    return deg * Math.PI / 180;
}

function rad2deg(rad) {
    // Convert radians to degrees
    return 180.0 * rad / Math.PI;
}

function to_decimal(x, num_digits = FLOAT_PRECISION) {
    return parseFloat(x.toFixed(num_digits));
}

function to_mm(v, unit) {
    // Helper to convert value to mm
    switch (unit) {
        case "m":
            return v * 1000;
        case "cm":
            return v * 10;
        case "mm":
        default:
            return v;
    }
}

function from_mm(v, unit) {
    // Helper to convert value from mm to other unit
    switch (unit) {
        case "m":
            return v / 1000;
        case "cm":
            return v / 10;
        case "mm":
        default:
            return v;
    }
}

function hsl2rgb(h, s, l) {
    // Convert HSL color to RGB color (0 to 100 value not 255)
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)];
}

function rgb2hex(rgb) {
    // Convert RGB color to HSL color
    return `#${_.reduce(rgb, (res, v) => res + parseInt(255 * v).toString(16).toUpperCase().padStart(2, '0'), "")}`;
}

function average(points) {
    // compute average positions of 3D points
    const num_points = points.length;
    let [x_sum, y_sum, z_sum] = [0, 0, 0];
    _.forEach(points, (point) => {
        x_sum += point[0];
        y_sum += point[1];
        z_sum += point[2];
    });
    return [x_sum / num_points, y_sum / num_points, z_sum / num_points];
}

function get_centroid(points) {
    // Approximate centroid by average of point positions
    return average(points);
}

function compute_hash_from_geometry(area, angles, edge_distances) {
    // Sort parameters to compare symmetric geometry
    const hash_parameters = {
        area: to_decimal(area, FLOAT_2_STR_PRECISION),
        angles: _.sortBy(
            _.map(angles, (a) => to_decimal(a, FLOAT_2_STR_PRECISION))
        ),
        edge_distances: _.sortBy(
            _.map(edge_distances, (d) => to_decimal(d, FLOAT_2_STR_PRECISION))
        ),
    };

    // Sort parameters to compare geometries
    const hash = encode_params(hash_parameters);
    return hash;
}

// -----------------------------
// ========== Helpers ==========
// -----------------------------

class LRU {
    constructor(max = 100) {
        this.max = max;
        this.cache = new Map();
    }

    get(key) {
        let item = this.cache.get(key);
        if (item !== undefined) {
            // refresh key
            this.cache.delete(key);
            this.cache.set(key, item);
        }
        return item;
    }

    set(key, val) {
        // refresh key
        if (this.cache.has(key)) this.cache.delete(key);
        // evict oldest
        else if (this.cache.size === this.max) this.cache.delete(this.first());
        this.cache.set(key, val);
    }

    first() {
        return this.cache.keys().next().value;
    }
}

function humanize_distance(d, num_digits = FLOAT_2_STR_PRECISION) {
    // Helper to display distances
    if (isNaN(d)) {
        return "";
    }
    // Distance are in milimeters
    if (d >= 1e7) {
        return to_decimal(d / 1e6, num_digits) + "km";
    } else if (d >= 1e4) {
        return to_decimal(d / 1e3, num_digits) + "m";
    } else if (d >= 1e2) {
        return to_decimal(d / 10, num_digits) + "cm";
    } else {
        return to_decimal(d, num_digits) + "mm";
    }
}

function humanize_area(d, num_digits = FLOAT_2_STR_PRECISION) {
    // Helper to display areas
    if (isNaN(d)) {
        return "";
    }

    // Area are in mm²
    if (d >= 1e12) {
        return to_decimal(d / 1e12, num_digits) + "km²";
    } else if (d >= 1e6) {
        return to_decimal(d / 1e6, num_digits) + "m²";
    } else if (d >= 100) {
        return to_decimal(d / 100, num_digits) + "cm²";
    } else {
        return to_decimal(d, num_digits) + "mm²";
    }
}

function humanize_angle(a, fractionDigits = 2) {
    // Helper to display angle in degrees
    return !isNaN(a) ? a.toFixed(fractionDigits) + "°" : "";
}

function humanize_arr(arr, unit = "") {
    // Helper to display array elements
    const res = _.join(_.map(arr, v => v + unit), " ");
    return `${res}`;
}

function unique_arr(arr) {
    // Set retains list order
    const s = new Set(arr);
    return [...s];
}


function get_boundaries(points) {
    // Compute Boundaries
    let x_max = Number.MIN_VALUE,
        y_max = Number.MIN_VALUE,
        z_max = Number.MIN_VALUE,
        x_min = Number.MAX_VALUE,
        y_min = Number.MAX_VALUE,
        z_min = Number.MAX_VALUE;

    for (let i = 0; i < points.length; i++) {
        const [x, y, z] = points[i];

        // Save Boundaries
        if (x < x_min) x_min = x;
        if (x > x_max) x_max = x;
        if (y < y_min) y_min = y;
        if (y > y_max) y_max = y;
        if (z < z_min) z_min = z;
        if (z > z_max) z_max = z;
    }

    // Compute width and height from 2D boundaries
    const width = Math.abs(x_max - x_min);
    const height = Math.abs(y_max - y_min);
    const depth = Math.abs(z_max - z_min);
    return [x_min, x_max, y_min, y_max, z_min, z_max, width, height, depth];
}

function download(filename, href) {
    const element = document.createElement("a");
    element.download = filename;
    element.href = href;
    element.click();
    element.remove();
}


// -----------------------------
// ========== Classes ==========
// -----------------------------

class Color {
    constructor(hue, saturation, lightness) {
        // Class to create magic color
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
        this.rgb = hsl2rgb(hue, saturation, lightness);
        this.hex = rgb2hex(this.rgb);
    }

    static from_angles(hue_angle = 0, lightness_angle = 0) {
        // Magic colors, pass radian angles
        const hue = Math.round(((4 + hue_angle) % TAU) / TAU * 360);
        const lightness = Math.min(80, Math.max(60, 60 + Math.abs(lightness_angle / TAU_Q) * 20));
        const saturation = 80;
        return new Color(hue, saturation, lightness);
    }

    static from_index(index, arr_length) {
        // Magic colors, with index and array length
        const hue_angle = (index % arr_length) * TAU / arr_length;
        return Color.from_angles(hue_angle, TAU_Q / 2);
    }
}

const COLOR_BASE = Color.from_angles(0, 0);

class LabeledObject {
    constructor(label, color) {
        // With color and label it's more fun
        this.label = label || "";
        this.color = color || COLOR_BASE;
    }
}

class Base3DGeometry extends LabeledObject {
    constructor(points, label, color) {
        // Call parent constructor
        super(label, color);

        const num_points = points.length;
        if (num_points < 3) {
            console.error("Not enough points to make a simple geometry");
            return;
        }

        // Store points
        this.points = points;
        this.num_points = this.points.length;

        // Take first point as Origin
        this.origin = this.points[0];
        this.centroid = get_centroid(points);

        // Compute boundaries
        const [x_min, x_max, y_min, y_max, z_min, z_max, width, height, depth] = get_boundaries(this.points);
        this.x_min = x_min;
        this.x_max = x_max
        this.y_min = y_min;
        this.y_max = y_max;
        this.z_min = z_min;
        this.z_max = z_max;
        this.width = width;
        this.height = height;
        this.depth = depth;

        // Compute the slope on the x and z Axes, maybe there is a better method
        this.slope = angle(this.origin, this.centroid, [this.origin[0], this.centroid[1], this.origin[2]]);
    }

    fit_points() {
        // Adjust the points so the minimum values end up at zero
        return this.points.map(p => [p[0] - this.x_min, p[1] - this.y_min, p[2] - this.z_min]);
    }
}

class Polygon2D extends Base3DGeometry {
    // Call by flatten method from Polygon3D
    // Points are distributed counterclockwise

    constructor(points, label, color) {
        // Call parent constructor
        super(points, label, color);

        // Points without the z axis
        this.points_2D = this.points.map(p => [p[0], p[1]]);
    }

    fit_points_2D() {
        // Adjust the points so the minimum values end up at zero
        return this.points.map(p => [p[0] - this.x_min, p[1] - this.y_min]);
    }

    resize_points(size = null) {
        // Recompute pixel positions to a specific size (ex : for svg display)
        const pixel_ratio = size / Math.max(this.height, this.width);
        const center = size / 2;
        return this.points_2D.map(p => [
            (p[0] - this.x_min - this.width / 2) * pixel_ratio + center,
            (p[1] - this.y_min - this.height / 2) * pixel_ratio + center,
        ]);
    }
}


class Polygon3D extends Base3DGeometry {
    // Consider A convex polygon          A
    // points = [A, B, C, D, E]         B ◇ E
    //                                   C D
    //
    // points are distributed counterclockwise

    constructor(points, label, color) {
        // Call parent constructor
        super(points, label, color);

        // Check coplanarity
        if (this.num_points > 3 && !is_coplanar(this.points)) {
            console.error(`The polygon is not coplanar`);
        }

        // Because we consider this polygon coplanar, we make a plane with 3 points
        this.plane = points_2_plane(this.points[0], this.points[1], this.points[this.num_points - 1]);

        // TODO : remove from the class and compute distance outside
        this.diameter = 2 * dist(this.points[1], [0, this.points[1][1], 0]);

        // Compute number of faces of a polygon for 3D visualization
        this.num_faces = 3 * (this.num_points - 2);

        // Arrays of THREE.Vector3 for 3D visualization
        this.faces = new Array(this.num_faces);
        this.edge_points = new Array(this.num_points * 2);

        // Geometry parameters
        this.area = 0;
        this.perimeter = 0;
        this.angles = [];               // Array of angles in radians
        this.edge_distances = [];       // Edges distances

        // Compute angle, edge distances, perimeter and area, centroid, and faces
        let face_index = 0;
        _.forEach(this.points, (current_point, i) => {
            const prev_point = this.points[(this.num_points + i - 1) % this.num_points];
            const next_point = this.points[(i + 1) % this.num_points];
            const next_next_point = this.points[(i + 2) % this.num_points];

            // Compute angle in radians
            this.angles.push(angle(prev_point, current_point, next_point));

            // Compute edges distances, and perimeter
            const d = dist(current_point, next_point)
            this.edge_distances.push(d);
            this.perimeter += d;

            // Compute area of the triangle
            this.area += triangle_area_from_points(this.origin, next_point, next_next_point);

            // Prepare line segments points
            this.edge_points[i * 2] = new THREE.Vector3(...current_point);
            this.edge_points[i * 2 + 1] = new THREE.Vector3(...next_point);

            // Compute face triangle
            if (face_index < this.num_faces) {
                // Faces for 3D
                this.faces[face_index] = new THREE.Vector3(...this.origin)
                this.faces[face_index + 1] = new THREE.Vector3(...next_point)
                this.faces[face_index + 2] = new THREE.Vector3(...next_next_point)
                face_index += 3;
            }
        });

        // Flattens the points with the origin at zero and the start_pt1 on the y axis, only 2D points
        this.flattened_points = flatten_3D_points(this.points, this.origin, this.centroid, this.points[1], false);

        // Compute hash to compare polygons
        this.hash = compute_hash_from_geometry(this.area, this.angles, this.edge_distances);
    }

    flatten_2D() {
        return new Polygon2D(this.flattened_points, this.label, this.color);
    }
}


class TrapezoidalPrism extends Base3DGeometry {
    constructor(points, label, color) {
        const num_points = points.length;
        if (num_points !== 8) {
            console.error("TrapezoidalPrism must have 8 point");
            return;
        }

        // Call parent constructor
        super(points, label, color);

        // Build the 6 sides of TrapezoidalPrism with Polygon
        this.top = new Polygon3D(this.filter_points_by_side("top", this.points));        // Top side
        this.bottom = new Polygon3D(this.filter_points_by_side("bottom", this.points));  // Bottom side
        this.left = new Polygon3D(this.filter_points_by_side("left", this.points));      // Left side
        this.right = new Polygon3D(this.filter_points_by_side("right", this.points));    // Right side
        this.front = new Polygon3D(this.filter_points_by_side("front", this.points));    // Front side
        this.back = new Polygon3D(this.filter_points_by_side("back", this.points));      // Back side

        // Flattens point with the right side at zero
        const [A, B, C, D, E, F, G, H] = this.points;
        this.flattened_points = flatten_3D_points(this.points, D, B, H, true);

        // Arrays of THREE.Vector3 for 3D visualization
        this.faces = [];
        this.edge_points = []

        // Geometry parameters
        this.area = 0;
        this.angles = [];
        this.edge_distances = [];

        const polygons = [this.top, this.bottom, this.left, this.right, this.front, this.back];
        _.forEach(polygons, (fig) => {
            this.faces.push(...fig.faces);
            this.edge_points.push(...fig.edge_points);

            this.angles.push(...fig.angles);
            this.edge_distances.push(...fig.edge_distances);
            this.area += fig.area; // recompute area

        });
        this.num_faces = this.faces.length

        // Compute hash to compare prims
        this.hash = compute_hash_from_geometry(this.area, this.angles, this.edge_distances);
    }

    get_side(name = "top") {
        switch (name) {
            case "top":
                return this.top;
            case "bottom":
                return this.bottom;
            case "left":
                return this.left;
            case "right":
                return this.right;
            case "front":
                return this.front;
            case "back":
                return this.back;
        }
    }

    filter_points_by_side(side, points) {
        // Filter the 6 sides points of TrapezoidalPrism for Polygon construction
        const [A, B, C, D, E, F, G, H] = points || this.points;
        switch (side) {
            case "top":
                return [A, C, D, B];     // Top side
            case "bottom":
                return [E, G, H, F];     // Bottom side
            case "right":
                return [D, H, F, B];     // Right side
            case "left":
                return [C, G, E, A];     // Left side
            case "front":
                return [C, G, H, D];     // Front side
            case "back":
                return [A, E, F, B];     // Back side
        }
    }

    flatten(side = "top") {
        return new TrapezoidalPrism(this.flattened_points, this.label, this.color);
    }

    flatten_2D(side = "top") {
        // flatten pair of sides with three choices "top", "right" and "front";
        // Because svg display is different than three.js display, we reverse some axes.
        let flattened_points, opposite_side;
        switch (side) {
            case "top":
                flattened_points = swap_axes(this.flattened_points, "XZY");
                opposite_side = "bottom";
                break;
            case "right":
                flattened_points = this.flattened_points.map(p => [p[0], -p[1], 0]);
                opposite_side = "left";
                break;
            case "front":
                flattened_points = swap_axes(this.flattened_points, "ZYX").map(p => [-p[0], -p[1], 0])
                opposite_side = "back";
                break;
        }

        return new Polygon2D([
                ...this.filter_points_by_side(side, flattened_points),
                ...this.filter_points_by_side(opposite_side, flattened_points)
            ], this.label, this.color
        );
    }
}

class Zome {
    constructor(
        {
            num = null,
            rotation_angles = null,
            rotated_colors = null,
            vertices = null,
            cover_3D = null,
            hash_grouped_cover_3D = null,
            cover_3D_hashes = null,
            skeleton_3D = null,
            hash_grouped_skeleton_3D = null,
            skeleton_3D_hashes = null,
            flattened_cover_3D = null,
            timber_profiles_3D = null,
            floor = null,
            vanishing_lines = null
        }
    ) {
        this.num = num || 0;
        this.rotation_angles = rotation_angles || [];
        this.rotated_colors = rotated_colors || [];
        this.vertices = vertices || [];
        this.cover_3D = cover_3D || [];
        this.hash_grouped_cover_3D = hash_grouped_cover_3D || [];
        this.cover_3D_hashes = cover_3D_hashes || [];
        this.skeleton_3D = skeleton_3D || [];
        this.hash_grouped_skeleton_3D = hash_grouped_skeleton_3D || [];
        this.skeleton_3D_hashes = skeleton_3D_hashes || [];
        this.flattened_cover_3D = flattened_cover_3D || [];
        this.timber_profiles_3D = timber_profiles_3D || [];
        this.floor = floor || null;
        this.vanishing_lines = vanishing_lines || [];
    }
}

