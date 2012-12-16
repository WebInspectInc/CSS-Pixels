
$(document).ready(function()
{
	var pBoard = new pixelBoard();
	$("#colorPicker").change(function()
	{
		color = "#" + $(this).val();
	});
});

var canvas = "#c", scale = 20, cursor = {}, grid = false, points = [], mouseOn = false, timeout, remainder, color = "#ffcc00", tool = 'draw';

function pixelBoard()
{
	draw();
	$(canvas).on('mousemove', function(e){ mouseMove(e); });
	$(canvas).on('mouseout', function(){ mouseOn = false; draw(); });
	$(canvas).on('mousedown', function(e){ mouseDown(e) });
	$(canvas).on('mouseup', function(e){ clearInterval(timeout) });
	$(canvas).on('touchmove', function(e){ mouseMove(e); });
	var c = document.getElementById("c");
	c.addEventListener('touchstart', function(e){ mouseDown(e) });
	c.addEventListener('touchmove', function(e) { e.preventDefault(); mouseMove(e) });
	c.addEventListener('touchend', function(e){ clearInterval(timeout) });
}

function mouseMove(e)
{
	mouseOn = true;
	var offset = $(canvas).offset();

	var x = e.pageX - offset.left;
	var y = e.pageY - offset.top;
	
	remainder = { x: x % scale, y: y % scale };
	cursor.x = x - remainder.x;
	cursor.y = y - remainder.y;
	draw();
}

function mouseDown(e)
{
	var checkPoints = function()
	{
		for (var i = 0; i < points.length; i++)
		{
			if (points[i].x == cursor.x / scale && points[i].y == cursor.y / scale)
			{
				if (tool == 'draw')
				{
					if (points[i].color != color)
					{
						points[i].color = color;
					}
					return;
				}
				else if (tool == 'erase')
				{
					points.splice(i,1);
					draw();
					return;
				}
			}
		}
		if (tool != 'erase')
			points.push({ x: cursor.x / scale, y: cursor.y / scale, color: color });
	}
	
	
	timeout = setInterval(function()
	{
		checkPoints();
	}, 20);
	
	checkPoints();
}

function draw()
{
	var c = document.getElementById("c");
	c.width = 20 * scale; c.height = 20 * scale;
	var cwidth = c.width;
	var cheight = c.height;
	var ctx = c.getContext('2d');
	
	/*ctx.strokeStyle="red";
	ctx.beginPath();
	for (var i = 0; i <= cwidth; i+=scale)
	{
		ctx.moveTo(i, 0);
		ctx.lineTo(i, cheight);
	}
	for (var i = 0; i <= cheight; i+=scale)
	{
		ctx.moveTo(0, i);
		ctx.lineTo(cwidth, i);
	}
	ctx.stroke();*/
	
	for (var i = 0; i < points.length; i++)
	{
		ctx.fillStyle = points[i].color;
		var x = points[i].x * scale;
		var y = points[i].y * scale;
		ctx.fillRect(x,y,scale,scale);
	}
	
	if (tool == 'draw')
		ctx.fillStyle = color;

	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	
	if (mouseOn)
	{
		if (tool == 'draw')
			ctx.fillRect(cursor.x,cursor.y,scale,scale);
		else if (tool == 'erase')
			ctx.strokeRect(cursor.x,cursor.y,scale,scale);
	}
}

function swapTools()
{
	var button = $("#eraser");
	console.log(button);
	if (tool == 'draw')
	{
		tool = 'erase';
		$(button).html('');
	}
	else
	{
		tool = 'draw';
		$(button).html('');
	}
}


function exportCSS()
{
	var text = "box-shadow:";
	for (var i = 0; i < points.length; i++)
	{
		var roundX = Math.round(points[i].x * 0.6 * 100)/100;
		var roundY = Math.round(points[i].y * 0.6 * 100)/100;
		text += "\n" + roundX + "em " + roundY + "em 0 " + points[i].color;
		if (i != points.length - 1)
			text += ",";
	}
	text += ";";
	$("#text").val(text);
	$("#text").addClass('showing');
}