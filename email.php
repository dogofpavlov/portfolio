<?php

// Enable error reporting for debugging purposes
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$responseType = isset($_POST['responseType']) ? $_POST['responseType'] : 'text';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullMessage = "";
    $fullMessage .= "Name: " . $_POST['name'] . "\n";
    $fullMessage .= "Company: " . $_POST['company'] . "\n";
    $fullMessage .= "Email: " . $_POST['email'] . "\n";
    $fullMessage .= "Location: " . $_POST['clocation'] . "\n";
    $fullMessage .= "Phone: " . $_POST['phone'] . "\n";
    $fullMessage .= "Website: " . $_POST['website'] . "\n";
    $fullMessage .= "Message: " . $_POST['message'] . "\n";

    $diditgo = mail("wolfofpavlov@gmail.com", "RyanCaillouet.com Contact Submission", $fullMessage);

    if ($responseType === 'json') {
        header("Content-Type: application/json");
        echo json_encode(['success' => $diditgo, 'message' => $diditgo ? 'Email sent successfully.' : 'Failed to send email.']);
    } else {
        echo $diditgo;
    }
} else {
    if ($responseType === 'json') {
        header("Content-Type: application/json");
        echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    } else {
        echo '0';
    }
}
?>
