import React, { useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    User as UserIcon,
    MapPin,
    Calendar,
    FileText,
    Download,
} from "lucide-react";

// Simple Toast component
function Toast({ message, onClose }) {
    if (!message) return null;
    return (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
            {message}
            <button className="ml-4 text-white font-bold" onClick={onClose}>
                &times;
            </button>
        </div>
    );
}

// Simple Modal component
function Modal({ show, onClose, onConfirm, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
                <div className="mb-4">{children}</div>
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-1 rounded bg-gray-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-1 rounded bg-red-600 text-white"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const map = {
        approved: "bg-blue-100 text-blue-700 border-blue-300",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        declined: "bg-red-100 text-red-700 border-red-300",
        cancelled: "bg-red-100 text-red-700 border-red-300",
        default: "bg-gray-100 text-gray-700 border-gray-300",
    };
    const cls = map[status] || map.default;
    return (
        <span
            className={`px-2 py-1 rounded border text-xs font-semibold capitalize ${cls}`}
        >
            {status}
        </span>
    );
}

function UserAvatar({ name }) {
    if (!name)
        return (
            <span className="inline-block w-8 h-8 rounded-full bg-gray-200" />
        );
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
            {initials}
        </span>
    );
}

export default function AdminReservations({ auth, reservations, flash }) {
    const { post, delete: destroy, processing } = useForm();
    const [toast, setToast] = useState(flash?.success || "");
    const [modal, setModal] = useState({
        show: false,
        id: null,
        selectRef: null,
    });

    // Show toast for flash messages
    React.useEffect(() => {
        if (flash?.success) setToast(flash.success);
    }, [flash?.success]);

    const handleAction = (id, action, selectRef) => {
        if (action === "approve") {
            post(route("admin.reservations.approve", id), {
                onSuccess: () => {
                    setToast("Reservation approved.");
                    selectRef.current.value = "";
                },
                onError: () => {
                    setToast("Failed to approve reservation.");
                },
            });
        } else if (action === "decline") {
            post(route("admin.reservations.decline", id), {
                onSuccess: () => {
                    setToast("Reservation declined.");
                    selectRef.current.value = "";
                },
                onError: () => {
                    setToast("Failed to decline reservation.");
                },
            });
        } else if (action === "delete") {
            setModal({ show: true, id, selectRef });
        }
    };

    const confirmDelete = () => {
        const { id, selectRef } = modal;
        destroy(route("admin.reservations.destroy", id), {
            onSuccess: () => {
                setToast("Reservation deleted.");
                if (selectRef?.current) selectRef.current.value = "";
                setModal({ show: false, id: null, selectRef: null });
            },
            onError: () => {
                setToast("Failed to delete reservation.");
                setModal({ show: false, id: null, selectRef: null });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold leading-tight text-blue-700 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-blue-500" />
                    All Reservations
                </h2>
            }
        >
            <Head title="All Reservations" />
            <Toast message={toast} onClose={() => setToast("")} />
            <Modal
                show={modal.show}
                onClose={() =>
                    setModal({ show: false, id: null, selectRef: null })
                }
                onConfirm={confirmDelete}
            >
                Are you sure you want to delete this reservation?
            </Modal>
            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                                Reservations List
                            </h3>
                            <span className="text-sm text-slate-500">
                                Total: {reservations.length}
                            </span>
                        </div>
                        {reservations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-blue-100 rounded-lg">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Customer
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Event Type
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Date
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Time
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Venue
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Guests
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Payment
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Status
                                            </th>
                                            <th className="px-4 py-2 border-b text-left text-xs font-medium text-blue-700 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-blue-50">
                                        {reservations.map((res) => {
                                            const selectRef = useRef();
                                            return (
                                                <tr
                                                    key={res.id}
                                                    className="hover:bg-blue-50"
                                                >
                                                    <td className="px-4 py-2 border-b">
                                                        <div className="flex items-start gap-3">
                                                            <UserAvatar
                                                                name={
                                                                    res.customer_full_name ||
                                                                    res.user?.name
                                                                }
                                                            />
                                                            <div>
                                                                <div className="font-medium text-slate-900">
                                                                    {res.customer_full_name ||
                                                                        res.user?.name ||
                                                                        "Unknown"}
                                                                </div>
                                                                {res.customer_address && (
                                                                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                                                        <MapPin className="w-3 h-3 mr-1" />
                                                                        {
                                                                            res.customer_address
                                                                        }
                                                                    </div>
                                                                )}
                                                                {res.customer_contact_number && (
                                                                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                                                        <UserIcon className="w-3 h-3 mr-1" />
                                                                        {
                                                                            res.customer_contact_number
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 border-b capitalize">
                                                        {res.event_type}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        {res.event_date}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        {res.event_time || "—"}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        {res.venue}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        {res.guest_count}
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <div className="text-xs space-y-1">
                                                            <div
                                                                className={`font-medium ${res.payment_status ===
                                                                        "Paid"
                                                                        ? "text-green-600"
                                                                        : "text-yellow-600"
                                                                    }`}
                                                            >
                                                                {res.payment_status ||
                                                                    "In Progress"}
                                                            </div>
                                                            {res.payments &&
                                                                res.payments
                                                                    .length >
                                                                0 &&
                                                                res.payments[0]
                                                                    .payment_method && (
                                                                    <div className="text-gray-500 capitalize">
                                                                        {res.payments[0].payment_method.replace(
                                                                            "_",
                                                                            " "
                                                                        )}
                                                                    </div>
                                                                )}
                                                            {res.receipts &&
                                                                res.receipts
                                                                    .length >
                                                                0 && (
                                                                    <div className="flex items-center gap-1 text-blue-600">
                                                                        <FileText className="w-3 h-3" />
                                                                        <a
                                                                            href={route(
                                                                                "receipts.view",
                                                                                res
                                                                                    .receipts[0]
                                                                                    .id
                                                                            )}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="hover:underline"
                                                                        >
                                                                            View
                                                                            Receipt
                                                                        </a>
                                                                        <a
                                                                            href={route(
                                                                                "receipts.download",
                                                                                res
                                                                                    .receipts[0]
                                                                                    .id
                                                                            )}
                                                                            className="hover:text-blue-800"
                                                                            title="Download Receipt"
                                                                        >
                                                                            <Download className="w-3 h-3" />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <StatusBadge
                                                            status={res.status}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b">
                                                        <div className="relative">
                                                            <select
                                                                ref={selectRef}
                                                                className="border rounded px-2 py-1 text-xs pr-8 focus:ring-blue-500 focus:border-blue-500"
                                                                defaultValue=""
                                                                disabled={
                                                                    processing
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.target
                                                                            .value
                                                                    ) {
                                                                        handleAction(
                                                                            res.id,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            selectRef
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <option
                                                                    value=""
                                                                    disabled
                                                                >
                                                                    Choose
                                                                    action
                                                                </option>
                                                                {res.status ===
                                                                    "pending" && (
                                                                        <option value="approve">
                                                                            Approve
                                                                        </option>
                                                                    )}
                                                                {res.status ===
                                                                    "pending" && (
                                                                        <option value="decline">
                                                                            Decline
                                                                        </option>
                                                                    )}
                                                                <option value="delete">
                                                                    Delete
                                                                </option>
                                                            </select>
                                                            {processing && (
                                                                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                                                                    <svg
                                                                        className="animate-spin h-4 w-4 text-blue-400"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <circle
                                                                            className="opacity-25"
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="10"
                                                                            stroke="currentColor"
                                                                            strokeWidth="4"
                                                                        ></circle>
                                                                        <path
                                                                            className="opacity-75"
                                                                            fill="currentColor"
                                                                            d="M4 12a8 8 0 018-8v8z"
                                                                        ></path>
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-slate-600 mb-2">
                                    No Reservations Yet
                                </h4>
                                <p className="text-slate-500 mb-6">
                                    No reservations found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
